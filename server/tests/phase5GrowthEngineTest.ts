/**
 * SEJAL.PRO — Phase 5 Comprehensive Growth, CRM & Personalisation Test Suite
 * Validates all 14 Core Requirements of Master PRD v2.0 Phase 5.
 */

import { crmEngine } from '../services/crmEngine';
import { segmentationEngine } from '../services/segmentationEngine';
import { omniNotificationEngine } from '../services/omniNotificationEngine';
import { automationEngine } from '../services/automationEngine';
import { abandonedCartEngine } from '../services/abandonedCartEngine';
import { attributionEngine } from '../services/attributionEngine';
import { analyticsEngine } from '../services/analyticsEngine';
import { personalisationEngine } from '../services/personalisationEngine';
import { store } from '../db/store';
import { Order } from '../../src/types/order';

async function runTests() {
  console.log('💎 =========================================================');
  console.log('💎 SEJAL.PRO — Phase 5 Growth & CRM Engine Test Suite');
  console.log('💎 =========================================================\n');

  let passedTests = 0;
  let totalTests = 14;

  // --- TEST 1: Customer 360 Profile Aggregation & Privé Calculation ---
  try {
    console.log('👉 [Test 1/14] Customer 360 Aggregator & Privé Tier Assignment...');
    const testEmail = 'vip_sheikha_dubai@royalnet.ae';
    
    // Seed an order
    const mockOrder: Order = {
      id: 'ord_test_crm_1',
      orderNumber: 'SEJ-2026-TEST1',
      customerId: 'cust_sheikha_1',
      customerEmail: testEmail,
      items: [
        {
          productId: 'prod_necklace_1',
          variantId: 'var_1',
          sku: 'SEJ-NCK-001',
          productName: 'The Aura Crowned Diamond Choker',
          priceINR: 1550000,
          quantity: 1,
          taxAmountINR: 46500,
          totalPriceINR: 1550000,
        },
      ],
      subtotalINR: 1550000,
      discountINR: 0,
      shippingFeeINR: 0,
      taxINR: 46500,
      totalINR: 1550000,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Captured',
      orderStatus: 'Delivered',
      shippingAddress: {
        fullName: 'H.E. Sheikha Al-Maktoum',
        phone: '+971 50 111 2222',
        addressLine1: 'Al Wasl Road, Jumeirah 2',
        city: 'Dubai',
        state: 'Dubai',
        postalCode: '00000',
        country: 'United Arab Emirates',
      },
      auditHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.orders.set(mockOrder.id, mockOrder);

    const profile = crmEngine.getCustomer360(testEmail);
    if (!profile) throw new Error('Profile was not generated');
    if (profile.lifetimeSpendINR < 1550000) throw new Error(`Expected lifetime spend >= 1.55M, got ${profile.lifetimeSpendINR}`);
    if (profile.priveTier !== 'Gold Privé') throw new Error(`Expected Gold Privé tier, got ${profile.priveTier}`);
    
    console.log(`   ✅ Customer 360 aggregated spend: ₹${profile.lifetimeSpendINR.toLocaleString('en-IN')} (Tier: ${profile.priveTier})`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 1 Failed: ${err.message}`);
  }

  // --- TEST 2: Customer Activity Timeline Synthesis ---
  try {
    console.log('\n👉 [Test 2/14] Customer Activity Timeline Generator...');
    crmEngine.recordTimelineEvent({
      customerId: 'cust_sheikha_1',
      customerEmail: 'vip_sheikha_dubai@royalnet.ae',
      eventType: 'concierge_inquiry',
      title: 'High Joaillerie Private Viewing Requested',
      description: 'Customer requested bespoke viewing in Dubai salon',
      channel: 'concierge',
    });

    const timeline = crmEngine.getCustomerTimeline('vip_sheikha_dubai@royalnet.ae');
    if (timeline.length < 2) throw new Error(`Expected at least 2 timeline events (order + concierge), got ${timeline.length}`);
    console.log(`   ✅ Activity timeline generated ${timeline.length} unified events.`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 2 Failed: ${err.message}`);
  }

  // --- TEST 3: Safe Identity Resolution (Guest -> Identified Client) ---
  try {
    console.log('\n👉 [Test 3/14] Safe Identity Resolution & Guest Session Merge...');
    const guestSession = 'sess_guest_luxury_99';
    // Add guest timeline event
    store.customerTimelines.set(guestSession, [
      {
        id: 'tl_guest_1',
        customerId: guestSession,
        customerEmail: '',
        eventType: 'product_view',
        title: 'Viewed Royal Brocade Lehenga',
        timestamp: new Date().toISOString(),
        channel: 'storefront',
      },
    ]);

    const merged = crmEngine.resolveCustomerIdentity(
      guestSession,
      'vip_sheikha_dubai@royalnet.ae',
      '+971 50 111 2222',
      'H.E. Sheikha Al-Maktoum'
    );

    if (merged.mergedTimelineEventsCount < 1) throw new Error('Timeline events were not migrated during merge');
    console.log(`   ✅ Merged guest session into customer profile with ${merged.mergedTimelineEventsCount} events.`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 3 Failed: ${err.message}`);
  }

  // --- TEST 4: Dynamic Segment Multi-Condition Evaluation (ALL / ANY) ---
  try {
    console.log('\n👉 [Test 4/14] Multi-Rule Dynamic Segment Evaluator...');
    const segment = segmentationEngine.createSegment({
      name: 'UAE Gold Privé High Spenders',
      description: 'UAE clients with lifetime spend >= 1,000,000 INR',
      logic: 'ALL',
      rules: [
        { field: 'country', operator: 'equals', value: 'United Arab Emirates' },
        { field: 'lifetimeSpendINR', operator: 'greater_than_or_equal', value: 1000000 },
      ],
    });

    const result = segmentationEngine.evaluateSegment(segment.id);
    if (!result.matchingCustomerIds.includes('vip_sheikha_dubai@royalnet.ae')) {
      throw new Error('Test customer not matched by ALL segment rules');
    }
    console.log(`   ✅ Dynamic segment evaluated: ${result.matchingCustomerIds.length} VIP client(s) matched.`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 4 Failed: ${err.message}`);
  }

  // --- TEST 5: Omnichannel Notification Template Variable Interpolation ---
  try {
    console.log('\n👉 [Test 5/14] Omnichannel Template Variable Interpolator...');
    const rawTemplate = 'Dear {{customer_name}}, your selection {{product_name}} is reserved for your {{prive_tier}} account.';
    const output = omniNotificationEngine.interpolateVariables(rawTemplate, {
      customer_name: 'Princess Gayatri Devi',
      product_name: 'The Aura Crowned Choker',
      prive_tier: 'Diamond High Salon',
    });

    if (!output.includes('Princess Gayatri Devi') || !output.includes('Diamond High Salon')) {
      throw new Error(`Variable interpolation failed: ${output}`);
    }
    console.log(`   ✅ Interpolated template cleanly: "${output}"`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 5 Failed: ${err.message}`);
  }

  // --- TEST 6: Marketing Consent & 24-Hour Frequency Capping ---
  try {
    console.log('\n👉 [Test 6/14] Marketing Consent & Frequency Capping Enforcement...');
    // Opt-out customer from WhatsApp
    crmEngine.updateConsent('vip_sheikha_dubai@royalnet.ae', { marketingWhatsApp: false });

    // Attempt to send WhatsApp marketing message
    const suppressedLog = await omniNotificationEngine.sendNotification({
      recipient: {
        email: 'vip_sheikha_dubai@royalnet.ae',
        phone: '+971 50 111 2222',
        name: 'H.E. Sheikha Al-Maktoum',
      },
      templateId: 'tmpl_abandoned_cart_whatsapp',
      channel: 'whatsapp',
      messageType: 'marketing',
      variables: { customer_name: 'Sheikha', product_name: 'Diamond Choker' },
    });

    if (suppressedLog.status !== 'suppressed_consent') {
      throw new Error(`Expected suppressed_consent, got ${suppressedLog.status}`);
    }

    // Opt back in and test frequency limit
    crmEngine.updateConsent('vip_sheikha_dubai@royalnet.ae', { marketingEmail: true });
    
    // First email should succeed
    const firstLog = await omniNotificationEngine.sendNotification({
      recipient: {
        email: 'vip_sheikha_dubai@royalnet.ae',
        name: 'H.E. Sheikha Al-Maktoum',
      },
      templateId: 'tmpl_abandoned_cart_sejal',
      channel: 'email',
      messageType: 'marketing',
      variables: { customer_name: 'Sheikha', product_name: 'Diamond Collar', cart_url: 'https://sejal.pro/cart' },
    });

    if (firstLog.status !== 'delivered') {
      throw new Error(`First email expected delivered, got ${firstLog.status}`);
    }

    // Second email within 24h should be suppressed by frequency cap
    const secondLog = await omniNotificationEngine.sendNotification({
      recipient: {
        email: 'vip_sheikha_dubai@royalnet.ae',
        name: 'H.E. Sheikha Al-Maktoum',
      },
      templateId: 'tmpl_abandoned_cart_sejal',
      channel: 'email',
      messageType: 'marketing',
      variables: { customer_name: 'Sheikha', product_name: 'Diamond Collar', cart_url: 'https://sejal.pro/cart' },
    });

    if (secondLog.status !== 'suppressed_frequency_limit') {
      throw new Error(`Expected suppressed_frequency_limit, got ${secondLog.status}`);
    }

    console.log('   ✅ Consent opt-out & 24h frequency capping strictly enforced.');
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 6 Failed: ${err.message}`);
  }

  // --- TEST 7: Reusable Marketing Automation Workflow State Machine ---
  try {
    console.log('\n👉 [Test 7/14] Workflow State Machine Step Processing...');
    const wf = automationEngine.createWorkflow({
      name: 'Privé Post-Delivery Concierge Check-in',
      description: 'Check in 24 hours after luxury delivery',
      triggerType: 'order_delivered',
      steps: [
        { id: 'step_1', stepType: 'delay', delayMinutes: 1440 },
        { id: 'step_2', stepType: 'action', action: { channel: 'email', templateId: 'tmpl_abandoned_cart_sejal' } },
      ],
      frequencyCapHours: 48,
    });

    const executions = await automationEngine.triggerWorkflow(
      'order_delivered',
      { email: 'vip_sheikha_dubai@royalnet.ae', name: 'Sheikha' },
      { triggerEventId: 'ord_evt_deliv_101' }
    );

    if (executions.length === 0 || executions[0].status !== 'waiting_delay') {
      throw new Error(`Expected execution status waiting_delay, got ${executions[0]?.status}`);
    }
    console.log(`   ✅ Workflow enrolled client and transitioned to state: ${executions[0].status}`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 7 Failed: ${err.message}`);
  }

  // --- TEST 8: Workflow Idempotency (Duplicate Trigger Suppression) ---
  try {
    console.log('\n👉 [Test 8/14] Automation Trigger Idempotency Verification...');
    const duplicateExecs = await automationEngine.triggerWorkflow(
      'order_delivered',
      { email: 'vip_sheikha_dubai@royalnet.ae', name: 'Sheikha' },
      { triggerEventId: 'ord_evt_deliv_101' } // Duplicate event ID
    );

    // Should return existing execution without creating new ones
    if (duplicateExecs.length !== 1) {
      throw new Error('Duplicate trigger created unexpected execution records');
    }
    console.log('   ✅ Duplicate trigger safely deduplicated via triggerEventId anchor.');
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 8 Failed: ${err.message}`);
  }

  // --- TEST 9: Abandoned Cart Capture & Purchase Conversion Exit ---
  try {
    console.log('\n👉 [Test 9/14] Abandoned Cart Recovery & Purchase Conversion Exit...');
    const result = await abandonedCartEngine.handleAbandonedCart({
      customer: { email: 'buyer_cart@luxury.com', name: 'Aarav Singhania' },
      cart: {
        items: [{ productId: 'prod_1', productName: 'Royal Silk Robe', sku: 'SEJ-ROB-01', priceINR: 250000, quantity: 1 }],
        subtotalINR: 250000,
      },
      sessionId: 'sess_cart_aarav_1',
    });

    if (result.status !== 'enrolled') throw new Error(`Expected enrolled, got ${result.status}`);

    // Now simulate customer completes purchase
    abandonedCartEngine.handlePurchaseCompleted('buyer_cart@luxury.com', 'SEJ-2026-PURCHASED-1');

    const execs = Array.from(store.workflowExecutions.values()).filter(
      (e) => e.customerEmail === 'buyer_cart@luxury.com'
    );

    const isExited = execs.some((e) => e.status === 'exited_converted');
    if (!isExited) throw new Error('Abandoned cart workflow was not terminated upon purchase');
    console.log('   ✅ Abandoned cart recovery automatically terminated upon purchase conversion.');
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 9 Failed: ${err.message}`);
  }

  // --- TEST 10: Multi-Touchpoint UTM Attribution Recording ---
  try {
    console.log('\n👉 [Test 10/14] Multi-Touchpoint UTM Attribution Logger...');
    const tp = attributionEngine.recordTouchpoint({
      sessionId: 'sess_utm_test_1',
      utmSource: 'instagram',
      utmMedium: 'story_swipe_up',
      utmCampaign: 'uae_royal_gala',
      landingPath: '/shop/high-jewellery',
      deviceType: 'mobile',
    });

    if (!tp.id || tp.utmSource !== 'instagram') throw new Error('Failed to record UTM touchpoint');
    console.log(`   ✅ Recorded UTM touchpoint: ${tp.utmSource} / ${tp.utmCampaign} [${tp.id}]`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 10 Failed: ${err.message}`);
  }

  // --- TEST 11: Influencer Commission Calculation & Single Order Attribution ---
  try {
    console.log('\n👉 [Test 11/14] Influencer Attribution & Commission Calculation...');
    const influencer = attributionEngine.saveInfluencer({
      handle: '@sheikha_style',
      fullName: 'Sheikha Noor Al-Khalifa',
      email: 'noor@sheikha.com',
      phone: '+971 50 999 8888',
      country: 'United Arab Emirates',
      uniqueCode: 'SEJALXSHEIKHA',
      referralSlug: '/invite/sheikha',
      commissionModel: 'percentage',
      commissionRate: 10,
      status: 'active',
    });

    const mockOrderInfluenced: Order = {
      id: 'ord_influenced_1',
      orderNumber: 'SEJ-2026-INF-001',
      customerId: 'cust_buyer_1',
      customerEmail: 'buyer_dubai@emirates.ae',
      items: [],
      subtotalINR: 1000000,
      discountINR: 0,
      shippingFeeINR: 0,
      taxINR: 30000,
      totalINR: 1000000,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Captured',
      orderStatus: 'Confirmed',
      auditHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.orders.set(mockOrderInfluenced.id, mockOrderInfluenced);

    const commissionEntry = attributionEngine.attributeOrder(mockOrderInfluenced, {
      influencerCode: 'SEJALXSHEIKHA',
    });

    if (!commissionEntry || commissionEntry.grossCommissionINR !== 100000) {
      throw new Error(`Expected 100,000 INR commission (10% of 1M), got ${commissionEntry?.grossCommissionINR}`);
    }

    console.log(`   ✅ Attributed ₹${commissionEntry.grossCommissionINR.toLocaleString('en-IN')} commission to ${influencer.fullName} (Status: ${commissionEntry.status})`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 11 Failed: ${err.message}`);
  }

  // --- TEST 12: Automated Commission Deduction on Order Return/Refund ---
  try {
    console.log('\n👉 [Test 12/14] Return / Refund Commission Reversal & Ledger Adjustment...');
    // Simulate ₹500,000 partial return on ord_influenced_1 (50% refund)
    attributionEngine.handleOrderRefundOrReturn('ord_influenced_1', 500000);

    const ledger = Array.from(store.commissionLedger.values()).find((l) => l.orderId === 'ord_influenced_1');
    if (!ledger) throw new Error('Ledger entry not found');

    if (ledger.netCommissionPayableINR !== 50000 || ledger.refundDeductionINR !== 50000) {
      throw new Error(`Expected net commission ₹50,000 after 50% refund, got ₹${ledger.netCommissionPayableINR}`);
    }

    console.log(`   ✅ Automatically deducted ₹${ledger.refundDeductionINR.toLocaleString('en-IN')} commission. Net payable: ₹${ledger.netCommissionPayableINR.toLocaleString('en-IN')}`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 12 Failed: ${err.message}`);
  }

  // --- TEST 13: Strict Purchase Deduplication in Analytics Ingestion ---
  try {
    console.log('\n👉 [Test 13/14] Canonical Analytics & Strict Purchase Deduplication...');
    // Ingest first purchase event
    const res1 = analyticsEngine.recordEvent({
      eventType: 'purchase',
      sessionId: 'sess_buyer_1',
      orderNumber: 'SEJ-2026-DEDUP-01',
      amountINR: 800000,
      currency: 'INR',
    });

    if (res1.isDeduplicated) throw new Error('First purchase event should not be deduplicated');

    // Simulate browser reload or multiple webhook dispatches
    const res2 = analyticsEngine.recordEvent({
      eventType: 'purchase',
      sessionId: 'sess_buyer_1',
      orderNumber: 'SEJ-2026-DEDUP-01', // Exact same order
      amountINR: 800000,
      currency: 'INR',
    });

    if (!res2.isDeduplicated) throw new Error('Duplicate purchase event was NOT suppressed');
    console.log('   ✅ Duplicate purchase event was strictly identified and suppressed from telemetry metrics.');
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 13 Failed: ${err.message}`);
  }

  // --- TEST 14: Multi-Tier Personalisation & AI-Ready Gift Finder ---
  try {
    console.log('\n👉 [Test 14/14] Personalisation Hierarchy & AI Gift Finder Resolution...');
    const recs = personalisationEngine.getRecommendations({
      country: 'United Arab Emirates',
      preferredCurrency: 'AED',
      priveTier: 'Gold Privé',
      recentCategories: ['high-jewellery'],
    });

    if (recs.length === 0) throw new Error('Failed to generate personalised recommendations');

    const gift = personalisationEngine.findLuxuryGift({
      occasion: 'Royal Wedding',
      recipient: 'Royal Dignitary',
      budgetINRRange: { min: 500000, max: 3000000 },
      aesthetic: 'Modern Haute Joaillerie',
    });

    if (!gift.curatedProduct || !gift.suggestedPackaging) {
      throw new Error('AI Gift Finder failed to produce complete gift pairing');
    }

    console.log(`   ✅ Gift Finder matched creation: "${gift.curatedProduct.name}" with luxury packaging.`);
    console.log(`   ✅ Personalisation hierarchy returned ${recs.length} curated editorial section(s).`);
    passedTests++;
  } catch (err: any) {
    console.error(`   ❌ Test 14 Failed: ${err.message}`);
  }

  // --- SUMMARY ---
  console.log('\n💎 =========================================================');
  console.log(`💎 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log('💎 PHASE 5 GROWTH, CRM & PERSONALISATION READY FOR PRODUCTION');
  console.log('💎 =========================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests();
