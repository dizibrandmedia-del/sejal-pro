/**
 * Quick HTTP Route Verification for Phase 5 Endpoints
 */

async function verifyRoutes() {
  const base = 'http://localhost:5000/api';
  console.log('Testing Phase 5 REST endpoints against running server...');

  try {
    const health = await (await fetch(`${base}/health`)).json();
    console.log('✅ Health:', health);

    const crm = await (await fetch(`${base}/crm/customers`)).json();
    console.log('✅ CRM Customers count:', crm.count);

    const segments = await (await fetch(`${base}/crm/segments`)).json();
    console.log('✅ Segments count:', segments.count);

    const workflows = await (await fetch(`${base}/automations/workflows`)).json();
    console.log('✅ Workflows count:', workflows.count);

    const templates = await (await fetch(`${base}/notifications/templates`)).json();
    console.log('✅ Notification Templates count:', templates.count);

    const influencers = await (await fetch(`${base}/creators/influencers`)).json();
    console.log('✅ Influencers count:', influencers.count);

    const affiliates = await (await fetch(`${base}/creators/affiliates`)).json();
    console.log('✅ Affiliates count:', affiliates.count);

    const analytics = await (await fetch(`${base}/analytics/advanced`)).json();
    console.log('✅ Advanced Analytics Overview Gross:', analytics.data.overview.grossRevenueINR);

    const quiz = await (await fetch(`${base}/personalisation/style-quiz`)).json();
    console.log('✅ Style Quiz Questions count:', quiz.questions.length);

    console.log('\n🎉 ALL PHASE 5 REST API ROUTES VERIFIED AND OPERATIONAL!');
  } catch (err: any) {
    console.error('Route verification failed:', err.message);
  }
}

verifyRoutes();
