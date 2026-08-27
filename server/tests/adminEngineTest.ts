/**
 * SEJAL.PRO — Phase 3 Comprehensive Automated Test Suite
 * Validates:
 * 1. Admin 2FA authentication & RBAC permission checks
 * 2. Dynamic Product-Type & Custom Attribute builder
 * 3. Dynamic Product creation with variants & attributes
 * 4. Dynamic Category & Collection hierarchy
 * 5. Dynamic Homepage section reordering & CMS publishing
 * 6. Dynamic Modular Landing Page creation
 * 7. Configurable Coupon engine & validation calculation
 * 8. Campaign lifecycle scheduler
 * 9. Safe two-phase CSV Import Pipeline (Validation & Ingestion)
 * 10. Bulk operations & audited price adjustments
 * 11. End-to-end Operations integration with Phase 2 Mutex & QC
 */

import { rbacEngine, ROLE_PERMISSIONS } from '../services/rbacEngine';
import { catalogueEngine } from '../services/catalogueEngine';
import { cmsEngine } from '../services/cmsEngine';
import { marketingEngine } from '../services/marketingEngine';
import { bulkEngine } from '../services/bulkEngine';
import { store } from '../db/store';
import { orderEngine } from '../services/orderEngine';
import { returnsEngine } from '../services/returnsEngine';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function runTest(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  ✓ PASS: ${name}`);
  } catch (err: any) {
    results.push({ name, passed: false, error: err.message });
    console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
  }
}

export async function runAdminCmsTestSuite() {
  console.log('\n======================================================');
  console.log('💎 SEJAL.PRO — PHASE 3 COMPLETE ENGINE TEST SUITE');
  console.log('======================================================\n');

  // 1. RBAC & 2FA Authentication
  await runTest('1. Admin 2FA Authentication & RBAC Permission Matrix', async () => {
    // Step 1: Initial auth challenge
    const auth1 = await rbacEngine.authenticateAdmin('sejal@sejal.pro', 'SejalPrivé2026!');
    assert(auth1.requires2FA === true, 'Super Admin must require 2FA challenge');
    assert(!!auth1.tempToken, 'Must generate temporary 2FA token');

    // Step 2: Verify TOTP
    const verifiedUser = await rbacEngine.verify2FA(auth1.tempToken!, '202688');
    assert(verifiedUser.email === 'sejal@sejal.pro', 'User email must match verified session');
    assert(rbacEngine.hasPermission(verifiedUser, 'products:write'), 'Super admin must have products:write');
    assert(rbacEngine.hasPermission(verifiedUser, 'refunds:issue'), 'Super admin must have refunds:issue');

    // Step 3: Product Manager limited permissions
    const prodMgr = store.adminUsers.get('usr_prod_mgr');
    assert(!!prodMgr, 'Product manager must exist');
    assert(rbacEngine.hasPermission(prodMgr!, 'products:write'), 'Product manager has product:write');
    assert(!rbacEngine.hasPermission(prodMgr!, 'refunds:issue'), 'Product manager MUST NOT have refunds:issue permission');
  });

  // 2. Dynamic Product-Type & Attribute Builder
  await runTest('2. Dynamic Product-Type & Attribute Builder without schema migrations', async () => {
    // Create Custom Attribute
    const newAttr = catalogueEngine.createAttribute({
      code: 'heel_height_mm',
      label: 'Heel Height (mm)',
      fieldType: 'number',
      unit: 'mm',
      isRequired: false,
    });
    assert(newAttr.code === 'heel_height_mm', 'Attribute code matches');

    // Create Product Type
    const newType = catalogueEngine.createProductType({
      name: 'Bespoke Footwear & Mules',
      code: 'bespoke-footwear',
      description: 'Hand-crafted velvet slippers and diamond-encrusted mules.',
      attributeIds: [newAttr.id],
      variantAttributeIds: [newAttr.id],
      hasVariants: true,
    });
    assert(newType.code === 'bespoke-footwear', 'Product type registered successfully');
    assert(newType.attributeIds.includes(newAttr.id), 'Attribute correctly attached to archetype');
  });

  // 3. Dynamic Product Creation with Matrix Variants
  await runTest('3. Dynamic Product Creation with Custom Attributes & Pricing Tiers', async () => {
    const product = catalogueEngine.createProduct({
      name: 'The Empress Emerald Collar',
      sku: 'SEJ-JW-EMP-001',
      productType: 'high-jewellery',
      category: 'high-jewellery',
      basePriceINR: 1850000,
      stock: 3,
      brand: 'SEJAL Signature',
      variants: [
        {
          id: 'var_emp_rg',
          title: '18K Rose Gold / Emerald Cut',
          sku: 'SEJ-JW-EMP-001-RG',
          priceINR: 1850000,
          stock: 2,
          options: { metal: '18K Rose Gold', cut: 'Emerald Cut' },
        },
        {
          id: 'var_emp_wg',
          title: '18K White Gold / Emerald Cut',
          sku: 'SEJ-JW-EMP-001-WG',
          priceINR: 1950000,
          stock: 1,
          options: { metal: '18K White Gold', cut: 'Emerald Cut' },
        },
      ],
    });

    assert(product.sku === 'SEJ-JW-EMP-001', 'Product created with SKU');
    assert(product.variants.length === 2, 'Variants generated correctly');

    // Verify inventory synchronization
    const invItem = store.inventory.get('SEJ-JW-EMP-001-RG');
    assert(!!invItem, 'Inventory auto-synced for variant SKU');
    assert(invItem!.availableQuantity === 2, 'Available quantity matches variant stock');
  });

  // 4. Dynamic Category & Collection Builder
  await runTest('4. Dynamic Category Hierarchy & Luxury Collection Builder', async () => {
    const category = catalogueEngine.createCategory({
      name: 'Royal Heritage Silks',
      slug: 'royal-heritage-silks',
      tagline: 'Woven in Varanasi for the Royal Court',
      subcategories: [
        { id: 'sub_zardozi', slug: 'zardozi-drapes', name: 'Zardozi Drapes' },
        { id: 'sub_brocade', slug: 'brocade-lehengas', name: 'Brocade Lehengas' },
      ],
    });
    assert(category.slug === 'royal-heritage-silks', 'Category created with slug');
    assert(category.subcategories.length === 2, 'Subcategories attached');

    const collection = catalogueEngine.createCollection({
      name: 'The Winter Solstice Gala Edit',
      slug: 'winter-solstice-gala',
      subtitle: 'Rare Colombian Emeralds & Velvet',
      featured: true,
    });
    assert(collection.slug === 'winter-solstice-gala', 'Collection created with slug');
  });

  // 5. Dynamic Homepage Section Reordering & CMS
  await runTest('5. Homepage Section Reordering & Real-Time CMS Scheduling', async () => {
    const originalSections = cmsEngine.getHomepageSections(true);
    assert(originalSections.length >= 10, 'All initial homepage sections loaded');

    // Reverse order
    const reversedIds = originalSections.map((s) => s.id).reverse();
    const updated = cmsEngine.reorderSections(reversedIds, 'Content Manager');

    assert(updated[0].id === reversedIds[0], 'First section matches new order');
    assert(updated[0].sortOrder === 1, 'Sort order normalized to 1');
  });

  // 6. Modular Landing Page Builder
  await runTest('6. Modular Landing Page Creation with Dynamic Layout Blocks', async () => {
    const page = cmsEngine.createLandingPage({
      title: 'The UAE Royal Collection',
      slug: 'uae-luxury-edit',
      tagline: 'Exclusive Haute Horology & Diamond Suites in Dubai',
      blocks: [
        {
          id: 'blk_hero',
          type: 'hero_banner',
          title: 'Unveiled at Dubai International Financial Centre',
          sortOrder: 1,
        },
        {
          id: 'blk_spotlight',
          type: 'collection_spotlight',
          collectionSlug: 'signature-collection',
          sortOrder: 2,
        },
      ],
    });

    assert(page.slug === 'uae-luxury-edit', 'Landing page slug matches');
    assert(page.blocks.length === 2, 'Blocks attached correctly');

    const fetched = cmsEngine.getLandingPage('uae-luxury-edit');
    assert(!!fetched, 'Landing page retrievable by slug');
  });

  // 7. Configurable Coupon Engine
  await runTest('7. Coupon Engine Thresholds, Caps & Discount Calculation', async () => {
    // Create Coupon
    const coupon = marketingEngine.createCoupon({
      code: 'VIPGIFT25',
      discountType: 'percentage',
      discountValue: 25,
      minCartValueINR: 100000,
      maxDiscountINR: 50000,
      eligibleCountries: ['India', 'United Arab Emirates'],
    });

    // Test 1: Below threshold
    const testBelow = marketingEngine.validateCouponForCart({
      code: 'VIPGIFT25',
      subtotalINR: 50000,
      country: 'India',
    });
    assert(testBelow.isValid === false, 'Must reject cart below minCartValueINR');

    // Test 2: Ineligible country
    const testCountry = marketingEngine.validateCouponForCart({
      code: 'VIPGIFT25',
      subtotalINR: 200000,
      country: 'United States',
    });
    assert(testCountry.isValid === false, 'Must reject country not in eligibleCountries');

    // Test 3: Valid calculation with max cap
    const testValid = marketingEngine.validateCouponForCart({
      code: 'VIPGIFT25',
      subtotalINR: 300000,
      country: 'India',
    });
    assert(testValid.isValid === true, 'Must validate eligible cart');
    assert(testValid.discountINR === 50000, 'Discount must be capped at maxDiscountINR (₹50,000)');
  });

  // 8. Campaign Lifecycle Scheduler
  await runTest('8. Integrated Campaign Scheduler & State Propagation', async () => {
    const campaign = marketingEngine.createCampaign({
      name: 'The Spring Solitaire Launch 2027',
      landingPageSlug: 'uae-luxury-edit',
      couponCode: 'VIPGIFT25',
      targetAudience: 'VIP Privé Clients',
    });

    assert(campaign.status === 'active', 'Campaign marked active upon launch');
    const allCampaigns = marketingEngine.listCampaigns();
    assert(allCampaigns.some((c) => c.id === campaign.id), 'Campaign listed in registry');
  });

  // 9. Safe Two-Phase CSV Import Pipeline
  await runTest('9. Safe Two-Phase CSV Import Pipeline (Validation & Ingestion)', async () => {
    const corruptRows = [
      { sku: '', name: 'Invalid Product', basePriceINR: 'bad', stock: 1 },
      { sku: 'SEJ-VAL-001', name: 'Valid Product 1', basePriceINR: 500000, stock: 2, category: 'high-jewellery' },
    ];

    // Phase 1: Validate
    const validation = bulkEngine.validateProductCSV(corruptRows);
    assert(validation.canImport === false, 'Must block import when corrupt row is present');
    assert(validation.invalidRows === 1, 'Accurately flags 1 invalid row');

    // Valid Rows
    const validRows = [
      { sku: 'SEJ-VAL-001', name: 'The Sovereign Diamond Ring', basePriceINR: 650000, stock: 2, category: 'high-jewellery' },
      { sku: 'SEJ-VAL-002', name: 'The Heirloom Pearl Choker', basePriceINR: 950000, stock: 1, category: 'high-jewellery' },
    ];
    const validationGood = bulkEngine.validateProductCSV(validRows);
    assert(validationGood.canImport === true, 'Permits import when 100% valid');

    // Phase 2: Atomic Ingestion
    const ingest = bulkEngine.commitProductCSV(validRows, 'Product Manager');
    assert(ingest.importedCount === 2, 'Successfully ingested 2 products');

    const createdProd = catalogueEngine.getProduct('SEJ-VAL-001');
    assert(!!createdProd, 'Ingested product is active in catalogue');
    assert(createdProd!.basePriceINR === 650000, 'Ingested price matches CSV value');
  });

  // 10. Bulk Operations & Audited Updates
  await runTest('10. Bulk Batch Editor with Price Adjustment Multiplier', async () => {
    const prod = catalogueEngine.getProduct('SEJ-VAL-001');
    assert(!!prod, 'Target product exists');

    const updatedCount = bulkEngine.bulkUpdateProducts({
      productIds: [prod!.id],
      priceAdjustmentMultiplier: 1.10, // +10%
      actor: 'Product Manager',
    });

    assert(updatedCount === 1, '1 product updated in bulk');
    const updatedProd = catalogueEngine.getProduct('SEJ-VAL-001');
    assert(updatedProd!.basePriceINR === 715000, 'Price increased by exactly 10% (650k * 1.1 = 715k)');
  });

  // 11. End-to-End Operations Integration with Phase 2 Engine
  await runTest('11. Operations Synchronization (Order Transitions & Returns QC)', async () => {
    // 1. Create order
    const { order } = await orderEngine.createOrder({
      customer: {
        name: 'Princess Gayatri Devi',
        email: 'gayatridevi@jaipur-heritage.in',
        phone: '+91 98200 88990',
      },
      shippingAddress: {
        recipientName: 'Princess Gayatri Devi',
        phoneNumber: '+91 98200 88990',
        addressLine1: 'City Palace',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302002',
        country: 'India',
      },
      shippingMethod: {
        id: 'sejal_armoured',
        name: 'SEJAL Armoured Fleet',
        priceINR: 0,
        carrier: 'sejal_armoured',
        estimatedDays: '1-2 Days',
      },
      giftPackaging: {
        preference: 'Signature SEJAL Rose Gold Coffret & Silk Dust Pouch',
        message: 'With compliments',
      },
      currency: 'INR',
      currencyRate: 1,
      paymentMethod: 'razorpay',
      items: [
        {
          productId: 'prod-1',
          variantId: 'var-1-1',
          quantity: 1,
        },
      ],
    });

    assert(order.orderStatus === 'Payment Pending', 'Initial order state is Payment Pending');

    // 2. Create Razorpay payment record & simulate payment capture
    const paymentId = `pay_${Date.now()}`;
    const payment = {
      id: paymentId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: `rzp_ord_${Date.now()}`,
      amountINR: order.totalINR,
      currency: 'INR',
      currencyRateAgainstINR: 1,
      amountInCurrency: order.totalINR,
      status: 'Captured' as const,
      method: 'upi' as const,
      isSignatureVerified: true,
      refundedAmountINR: 0,
      outstandingAmountINR: order.totalINR,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      capturedAt: new Date().toISOString(),
    };
    store.payments.set(payment.id, payment);
    order.paymentId = payment.id;
    order.paymentStatus = 'Captured';
    store.orders.set(order.id, order);

    // 3. Deliver the order through valid state machine transitions
    await orderEngine.transitionOrderStatus(order.id, 'Confirmed', 'Order Manager');
    await orderEngine.transitionOrderStatus(order.id, 'Processing', 'Order Manager');
    await orderEngine.transitionOrderStatus(order.id, 'Quality Check', 'Order Manager');
    await orderEngine.transitionOrderStatus(order.id, 'Packed', 'Order Manager');
    await orderEngine.transitionOrderStatus(order.id, 'Ready to Ship', 'Order Manager');
    await orderEngine.transitionOrderStatus(order.id, 'Shipped', 'Order Manager');
    await orderEngine.transitionOrderStatus(order.id, 'In Transit', 'Order Manager');
    await orderEngine.transitionOrderStatus(order.id, 'Delivered', 'Order Manager');

    // 3. Submit Return Request on item
    const orderItemId = order.items[0].id;
    const returnReq = await returnsEngine.submitReturnRequest({
      orderId: order.id,
      items: [
        {
          orderItemId,
          quantity: 1,
          reason: 'Incorrect Size or Fit',
        },
      ],
    });

    assert(returnReq.status === 'Requested', 'Return request created in Requested state');

    // 4. Perform Quality Check & Stock Disposition
    const inspected = await returnsEngine.executeQualityCheck({
      returnId: returnReq.id,
      inspectorName: 'Chief Gemologist',
      receivedCondition: 'Pristine in Vault Box',
      securityTagIntact: true,
      certificatePresent: true,
      disposition: 'Restock',
      isApproved: true,
      approvedRefundAmountINR: 650000,
      notes: 'Diamond setting and 18K gold hallmarks certified in pristine condition.',
    });

    assert(inspected.status === 'Refund Initiated' || inspected.status === 'Refund Completed', 'Return completed after QC pass');
  });

  console.log('\n======================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  console.log(`TEST SUITE FINISHED: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('======================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

// Run test suite if invoked directly
runAdminCmsTestSuite().catch((err) => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
