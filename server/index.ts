import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ENV } from './config/environment';
import { paymentsRouter } from './routes/payments';
import { webhooksRouter } from './routes/webhooks';
import { ordersRouter } from './routes/orders';
import { inventoryRouter } from './routes/inventory';
import { shippingRouter } from './routes/shipping';
import { returnsRouter } from './routes/returns';
import { refundsRouter } from './routes/refunds';
import { simulatorRouter } from './routes/simulator';
import { adminAuthRouter } from './routes/adminAuth';
import { catalogueRouter } from './routes/catalogue';
import { cmsRouter } from './routes/cms';
import { marketingRouter } from './routes/marketing';
import { bulkRouter } from './routes/bulk';
import { analyticsRouter } from './routes/analytics';
import crmRouter from './routes/crm';
import automationsRouter from './routes/automations';
import notificationsRouter from './routes/notifications';
import attributionRouter from './routes/attribution';
import creatorsRouter from './routes/creators';
import personalisationRouter from './routes/personalisation';

const app = express();

// Middleware: Enable CORS for Vite frontend
app.use(cors());

// Middleware: JSON parser with rawBody capture for cryptographic webhook HMAC verification
app.use(
  express.json({
    verify: (req: Request, _res: Response, buf: Buffer) => {
      (req as any).rawBody = buf.toString();
    },
  })
);

app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    platform: 'SEJAL.PRO Growth, Commerce & Personalisation Engine',
    version: '5.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Register Phase 2 REST API Routers
app.use('/api/payments', paymentsRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/shipping', shippingRouter);
app.use('/api/returns', returnsRouter);
app.use('/api/refunds', refundsRouter);
app.use('/api/simulator', simulatorRouter);

// Register Phase 3 Admin & CMS REST API Routers
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/catalogue', catalogueRouter);
app.use('/api/cms', cmsRouter);
app.use('/api/marketing', marketingRouter);
app.use('/api/bulk', bulkRouter);
app.use('/api/analytics', analyticsRouter);

// Register Phase 5 Growth, CRM, Attribution & Personalisation Routers
app.use('/api/crm', crmRouter);
app.use('/api/automations', automationsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/attribution', attributionRouter);
app.use('/api/creators', creatorsRouter);
app.use('/api/personalisation', personalisationRouter);

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Server Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Commerce Server Error',
  });
});

app.listen(ENV.PORT, () => {
  console.log(`✨ SEJAL.PRO Phase 2 Commerce Engine running on http://localhost:${ENV.PORT}`);
});

export default app;
