export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Event Hive',
  NODE_ENV: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
} as const