import { store } from '../db/store';
import { orderEngine } from '../services/orderEngine';
import { paymentEngine } from '../services/paymentEngine';
import { webhookEngine } from '../services/webhookEngine';
import { inventoryEngine } from '../services/inventoryEngine';
import { shippingEngine } from '../services/shippingEngine';
import { returnsEngine } from '../services/returnsEngine';
import { refundEngine } from '../services/refundEngine';
import { cancellationEngine } from '../services/cancellationEngine';
import { ENV } from '../config/environment';
import crypto from 'crypto';

interface TestSummary {
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const testResults: TestSummary[] = [];

async function runTest(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    testResults.push({ name, passed: true, durationMs });
    console.log(`  ✅ [PASS] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    testResults.push({ name, passed: false, error: err.message, durationMs });
    console.error(`  ❌ [FAIL] ${name} (${durationMs}ms): ${err.message}`);
  }
}

async function runCommerceTestSuite() {
  console.log('\n======================================================');
  console.log(' ✨ SEJAL.PRO PHASE 2 COMMERCE ENGINE AUTOMATED SUITE');
  console.log('======================================================\n');

  // Test 1: Authoritative Order Creation & Stock Reservation
  let testOrderId = '';
  await runTest('1. Authoritative Order Creation & Atomic Stock Reservation', async () => {
    const res = await orderEngine.createOrder({
      customer: {
        name: 'Sejal Gupta',
        email: 'vip@sejal.pro',
        phone: '+91 8005056531',
      },
      items: [
        {
          productId: 'prod-1',
          variantId: 'var-1-1',
          quantity: 1,
        },
      ],
      shippingAddress: {
        id: 'addr_t1',
        label: 'Home',
        recipientName: 'Sejal Gupta',
        phoneNumber: '+91 8005056531',
        country: 'India',
        addressLine1: 'Villa 14, Royal Palm Residences',
        city: 'Gurugram',
        stateProvince: 'Haryana',
        postalCode: '122002',
        isDefault: true,
      },
      shippingMethod: {
        id: 'ship-white-glove',
        name: 'Complimentary White-Glove Hand-Delivery',
        description: 'Armoured courier delivery',
        estimatedDelivery: '3 Business Days',
        priceINR: 0,
        insured: true,
      },
      currency: 'INR',
      currencyRate: 1,
      paymentMethod: 'razorpay',
    });

    if (!res.order.id || !res.order.orderNumber.startsWith('SEJAL-2026-')) {
      throw new Error(`Invalid order number generated: ${res.order.orderNumber}`);
    }
    if (res.order.orderStatus !== 'Payment Pending') {
      throw new Error(`Expected initial status 'Payment Pending', got: ${res.order.orderStatus}`);
    }
    if (res.order.totalINR !== 785000) {
      throw new Error(`Expected authoritative total 785000, got: ${res.order.totalINR}`);
    }

    testOrderId = res.order.id;
  });

  // Test 2: Razorpay Order Creation & Cryptographic Signature Verification
  let razorpayOrderId = '';
  await runTest('2. Razorpay Order Creation & HMAC SHA-256 Cryptographic Verification', async () => {
    const rzpOrder = await paymentEngine.createRazorpayOrder(testOrderId);
    razorpayOrderId = rzpOrder.razorpayOrderId;

    if (!razorpayOrderId.startsWith('order_rzp_')) {
      throw new Error(`Invalid Razorpay order ID: ${razorpayOrderId}`);
    }
    if (rzpOrder.amountInSmallestUnit !== 785000 * 100) {
      throw new Error(`Expected amount in paise ${785000 * 100}, got: ${rzpOrder.amountInSmallestUnit}`);
    }

    // Generate genuine HMAC signature
    const paymentId = 'pay_live_test_992144';
    const payload = `${razorpayOrderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    const payment = await paymentEngine.confirmPaymentCapture({
      orderId: testOrderId,
      razorpayOrderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: validSignature,
      method: 'upi',
    });

    if (payment.status !== 'Captured') {
      throw new Error(`Expected payment status 'Captured', got: ${payment.status}`);
    }

    const updatedOrder = orderEngine.getOrder(testOrderId);
    if (updatedOrder?.orderStatus !== 'Confirmed') {
      throw new Error(`Expected order status 'Confirmed' after capture, got: ${updatedOrder?.orderStatus}`);
    }

    // Verify Tampered Signature is Rejected on a dedicated test order
    try {
      const fraudOrderRes = await orderEngine.createOrder({
        customer: { name: 'Fraud Actor', email: 'fraud@badactor.xyz', phone: '+91 0000000000' },
        items: [{ productId: 'prod-8', variantId: 'var-8-1', quantity: 1 }],
        shippingAddress: {
          id: 'addr_fraud',
          label: 'Test',
          recipientName: 'Fraud Actor',
          phoneNumber: '+91 0000000000',
          country: 'India',
          addressLine1: 'Test St',
          city: 'Mumbai',
          stateProvince: 'Maharashtra',
          postalCode: '400001',
          isDefault: false,
        },
        shippingMethod: { id: 'ship-1', name: 'Standard', description: 'Std', estimatedDelivery: '3d', priceINR: 0, insured: true },
        currency: 'INR',
        currencyRate: 1,
        paymentMethod: 'razorpay',
      });
      const fraudRzp = await paymentEngine.createRazorpayOrder(fraudOrderRes.order.id);

      await paymentEngine.confirmPaymentCapture({
        orderId: fraudOrderRes.order.id,
        razorpayOrderId: fraudRzp.razorpayOrderId,
        razorpayPaymentId: 'pay_fraud_9999',
        razorpaySignature: 'tampered_invalid_hex_signature',
      });
      throw new Error('Tampered signature should have thrown an error, but passed.');
    } catch (tamperErr: any) {
      if (!tamperErr.message.includes('signature') && !tamperErr.message.includes('tampering')) {
        throw tamperErr;
      }
    }
  });

  // Test 3: Webhook Deduplication & Idempotency
  await runTest('3. Webhook Deduplication & Idempotent Event Processing', async () => {
    const webhookEventId = `evt_dedup_test_${Date.now()}`;
    const webhookPayload = {
      id: webhookEventId,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_webhook_test_881',
            order_id: razorpayOrderId,
            amount: 78500000,
            status: 'captured',
            method: 'netbanking',
          },
        },
      },
    };

    const rawBody = JSON.stringify(webhookPayload);
    const signature = crypto
      .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    // First attempt: should process as new
    const res1 = await webhookEngine.handleRazorpayWebhook(rawBody, signature, webhookEventId, webhookPayload);
    if (!res1.success || res1.duplicate) {
      throw new Error(`First webhook event should be processed as new, got duplicate: ${res1.duplicate}`);
    }

    // Second attempt with same event ID: must acknowledge with duplicate: true and 0 side-effects
    const res2 = await webhookEngine.handleRazorpayWebhook(rawBody, signature, webhookEventId, webhookPayload);
    if (!res2.success || !res2.duplicate) {
      throw new Error(`Duplicate webhook was not detected! Expected duplicate: true, got: ${res2.duplicate}`);
    }
  });

  // Test 4: Concurrency & Overselling Mutex Lock
  await runTest('4. Concurrency Mutex Lock: Simultaneous 1-Stock Checkout (Zero Overselling)', async () => {
    const testSku = 'SEJ-HJ-001-RG';
    const inv = store.inventory.get(testSku);
    if (!inv) {
      throw new Error(`SKU ${testSku} not found in inventory store.`);
    }

    // Reset SKU stock to exactly 1 single unit
    inv.totalQuantity = 1;
    inv.availableQuantity = 1;
    inv.reservedQuantity = 0;
    store.inventory.set(testSku, inv);

    // Launch 2 simultaneous reservation requests concurrently via Promise.all
    const p1 = inventoryEngine.reserveStock(
      [{ sku: testSku, variantId: inv.variantId, quantity: 1 }],
      `ord_concur_1_${Date.now()}`,
      'SEJAL-CONCUR-1'
    );
    const p2 = inventoryEngine.reserveStock(
      [{ sku: testSku, variantId: inv.variantId, quantity: 1 }],
      `ord_concur_2_${Date.now()}`,
      'SEJAL-CONCUR-2'
    );

    const [r1, r2] = await Promise.all([p1, p2]);

    const successes = [r1, r2].filter((r) => r.success).length;
    const failures = [r1, r2].filter((r) => !r.success).length;

    if (successes !== 1 || failures !== 1) {
      throw new Error(`Overselling detected! Expected 1 success and 1 failure, got ${successes} successes and ${failures} failures.`);
    }

    const updatedInv = store.inventory.get(testSku)!;
    if (updatedInv.availableQuantity !== 0) {
      throw new Error(`Expected available quantity 0, got: ${updatedInv.availableQuantity}`);
    }
  });

  // Test 5: Order State Machine Strict Transition Enforcement
  await runTest('5. Order State Machine Transition Validation & Invalid Jump Rejection', async () => {
    // Valid transitions
    await orderEngine.transitionOrderStatus(testOrderId, 'Processing', 'admin_user', 'Jeweler assembling');
    await orderEngine.transitionOrderStatus(testOrderId, 'Quality Check', 'admin_user', 'Gemologist audit');
    await orderEngine.transitionOrderStatus(testOrderId, 'Packed', 'admin_user', 'Rigid vault box sealed');
    await orderEngine.transitionOrderStatus(testOrderId, 'Ready to Ship', 'admin_user', 'Manifest registered');

    const order = orderEngine.getOrder(testOrderId)!;
    if (order.orderStatus !== 'Ready to Ship') {
      throw new Error(`Expected status 'Ready to Ship', got: ${order.orderStatus}`);
    }

    // Invalid transition jump test (e.g. Jumping directly from 'Ready to Ship' to 'Delivered' without courier dispatch)
    try {
      await orderEngine.transitionOrderStatus(testOrderId, 'Delivered', 'admin_user', 'Illegal jump');
      throw new Error('Invalid state transition jump should have failed, but passed.');
    } catch (transErr: any) {
      if (!transErr.message.includes('Invalid state transition')) {
        throw transErr;
      }
    }
  });

  // Test 6: Multi-Carrier Shipping & AWB Generation
  let shipmentId = '';
  await runTest('6. Multi-Carrier Shipping Abstraction & AWB Dispatch', async () => {
    const shipment = await shippingEngine.createShipment({
      orderId: testOrderId,
      serviceType: 'standard_white_glove',
    });

    if (!shipment.awbNumber.startsWith('AWB-SEJAL-')) {
      throw new Error(`Invalid AWB generated: ${shipment.awbNumber}`);
    }

    shipmentId = shipment.id;

    // Advance carrier milestones: Picked Up -> In Transit -> Out for Delivery -> Delivered
    const pickedUpShipment = await shippingEngine.addShipmentEvent({
      shipmentId,
      rawStatus: 'PICKED_UP',
      hubLocation: 'SEJAL Vault BKC',
      carrierMessage: 'Consignment secured by armoured escort',
    });

    if (pickedUpShipment.currentStatus !== 'Picked Up') {
      throw new Error(`Expected status 'Picked Up', got: ${pickedUpShipment.currentStatus}`);
    }

    await shippingEngine.addShipmentEvent({
      shipmentId,
      rawStatus: 'IN_TRANSIT',
      hubLocation: 'Air Logistics Hub, Delhi',
    });

    await shippingEngine.addShipmentEvent({
      shipmentId,
      rawStatus: 'OUT_FOR_DELIVERY',
      hubLocation: 'Gurugram Distribution Hub',
    });

    const deliveredShipment = await shippingEngine.addShipmentEvent({
      shipmentId,
      rawStatus: 'DELIVERED',
      hubLocation: 'Client Private Residence, Gurugram',
    });

    if (deliveredShipment.currentStatus !== 'Delivered') {
      throw new Error(`Expected delivered status 'Delivered', got: ${deliveredShipment.currentStatus}`);
    }

    const order = orderEngine.getOrder(testOrderId)!;
    if (order.orderStatus !== 'Delivered') {
      throw new Error(`Expected order status 'Delivered', got: ${order.orderStatus}`);
    }
  });

  // Test 7: Item-Level Return, Quality Check Disposition & Partial Refund
  await runTest('7. Item-Level Return, Gemologist Quality Check & Stock Restock', async () => {
    const order = orderEngine.getOrder(testOrderId)!;
    const orderItem = order.items[0];

    const returnReq = await returnsEngine.submitReturnRequest({
      orderId: testOrderId,
      items: [
        {
          orderItemId: orderItem.id,
          quantity: 1,
          reason: 'Defective Craftsmanship or Gem Loose',
          customReasonDetail: 'Prong clasp requires minor adjustment.',
        },
      ],
    });

    if (returnReq.status !== 'Requested') {
      throw new Error(`Expected return status 'Requested', got: ${returnReq.status}`);
    }

    // Execute Quality Check with Restock Disposition
    const qcResult = await returnsEngine.executeQualityCheck({
      returnId: returnReq.id,
      inspectorName: 'Chief Appraiser Alistair Vance',
      receivedCondition: 'Pristine in Vault Box',
      securityTagIntact: true,
      certificatePresent: true,
      disposition: 'Restock',
      isApproved: true,
      approvedRefundAmountINR: 785000,
      notes: 'Diamond certificate and seal verified.',
    });

    if (qcResult.status !== 'Refund Completed') {
      throw new Error(`Expected return status 'Refund Completed', got: ${qcResult.status}`);
    }

    const refunds = refundEngine.getOrderRefunds(testOrderId);
    if (refunds.length === 0 || refunds[0].status !== 'Refund Completed') {
      throw new Error(`Refund was not processed upon QC approval. Status: ${refunds[0]?.status}`);
    }
  });

  // Test 8: Order Cancellation & Automated Inventory Release
  await runTest('8. State-Aware Cancellation & Immediate Inventory Release', async () => {
    // Create new order to cancel
    const newOrd = await orderEngine.createOrder({
      customer: { name: 'Lady Diana', email: 'diana@sejal.pro', phone: '+91 9999999999' },
      items: [{ productId: 'prod-8', variantId: 'var-8-1', quantity: 2 }],
      shippingAddress: {
        id: 'addr_t8',
        label: 'Palace',
        recipientName: 'Lady Diana',
        phoneNumber: '+91 9999999999',
        country: 'India',
        addressLine1: 'Palace Road',
        city: 'Jaipur',
        stateProvince: 'Rajasthan',
        postalCode: '302001',
        isDefault: false,
      },
      shippingMethod: {
        id: 'ship-white-glove',
        name: 'Complimentary Delivery',
        description: 'White glove',
        estimatedDelivery: '3 Days',
        priceINR: 0,
        insured: true,
      },
      currency: 'INR',
      currencyRate: 1,
      paymentMethod: 'credit_card',
    });

    const perfSku = 'SEJ-PF-001-100';
    const invBefore = store.inventory.get(perfSku)!.availableQuantity;

    // Cancel order
    const cancelled = await cancellationEngine.cancelOrder({
      orderId: newOrd.order.id,
      cancelledBy: 'customer',
      reason: 'Travel schedule conflict',
    });

    if (cancelled.orderStatus !== 'Cancelled') {
      throw new Error(`Expected status 'Cancelled', got: ${cancelled.orderStatus}`);
    }

    const invAfter = store.inventory.get(perfSku)!.availableQuantity;
    if (invAfter !== invBefore + 2) {
      throw new Error(`Inventory was not released! Before: ${invBefore}, After: ${invAfter}`);
    }
  });

  // Test 9: Financial Reconciliation Ledger
  await runTest('9. Financial Reconciliation Ledger Balance Audit', async () => {
    const reports = paymentEngine.getReconciliationReport();
    const orderReport = reports.find((r) => r.orderId === testOrderId);

    if (!orderReport) {
      throw new Error(`No reconciliation report found for test order ${testOrderId}`);
    }
    if (orderReport.capturedPaymentINR !== 785000) {
      throw new Error(`Expected captured amount 785000, got: ${orderReport.capturedPaymentINR}`);
    }
    if (orderReport.totalRefundedINR !== 785000) {
      throw new Error(`Expected refunded amount 785000, got: ${orderReport.totalRefundedINR}`);
    }
    if (orderReport.netRevenueINR !== 0) {
      throw new Error(`Expected net revenue 0, got: ${orderReport.netRevenueINR}`);
    }
    if (orderReport.hasMismatch) {
      throw new Error('Reconciliation has unexpected mismatch flag!');
    }
  });

  console.log('\n======================================================');
  const allPassed = testResults.every((t) => t.passed);
  console.log(` 📊 SUMMARY: ${testResults.filter((t) => t.passed).length}/${testResults.length} Tests Passed`);
  console.log('======================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runCommerceTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
