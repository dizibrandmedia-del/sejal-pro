import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Razorpay Test / Production Credentials
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_sejal_luxury_master_key',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'secret_sejal_luxury_signature_9921',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_sejal_prive_auth_7812',
  
  // Shipping Carrier API Keys (stubs / test keys)
  SHIPROCKET_API_TOKEN: process.env.SHIPROCKET_API_TOKEN || 'sr_token_sejal_armoured_logistics',
  DHL_API_KEY: process.env.DHL_API_KEY || 'dhl_global_sejal_express_key',
  
  // Brand Configuration
  BRAND_NAME: 'SEJAL.PRO',
  FOUNDER_EMAIL: 'Sejal@Sejal.Pro',
  FOUNDER_PHONE: '+91 8005056531',
  
  // Currency Defaults
  DEFAULT_CURRENCY: 'INR',
  SUPPORTED_CURRENCIES: ['INR', 'USD', 'AED', 'AUD'],
};
