export default () => ({
  appEnv: process.env.APP_ENV ?? 'dev',
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM,
    verificationCodeTtl: parseInt(process.env.VERIFICATION_CODE_TTL ?? '900', 10),
    resendCooldownSecs: parseInt(process.env.VERIFICATION_RESEND_COOLDOWN_SECS ?? '60', 10),
  },
  userWebUrl: process.env.USER_WEB_URL ?? 'http://localhost:3002',
  apple: {
    clientIds: (process.env.APPLE_CLIENT_IDS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  },
  // Feature flags — set to 'true' to enable before the feature ships
  features: {
    premiumTier: process.env.FEATURE_PREMIUM_TIER === 'true',
    aiExpenseEntry: process.env.FEATURE_AI_EXPENSE_ENTRY === 'true',
    receiptOcr: process.env.FEATURE_RECEIPT_OCR === 'true',
  },
  // Currency exchange rates cache (offline-first, ADR-0005)
  currencyRates: {
    provider: process.env.CURRENCY_PROVIDER ?? 'fake',
    cacheTtlSecs: parseInt(process.env.CURRENCY_CACHE_TTL_SECS ?? '3600', 10),
  },
});
