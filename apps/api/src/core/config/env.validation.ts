import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  APP_ENV: Joi.string().valid('dev', 'qa', 'prod').required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  RESEND_API_KEY: Joi.string().required(),
  EMAIL_FROM: Joi.string().required(),
  VERIFICATION_CODE_TTL: Joi.number().default(900),

  USER_WEB_URL: Joi.string().uri().default('http://localhost:3002'),

  // Feature flags
  FEATURE_PREMIUM_TIER: Joi.boolean().default(false),
  FEATURE_AI_EXPENSE_ENTRY: Joi.boolean().default(false),
  FEATURE_RECEIPT_OCR: Joi.boolean().default(false),

  // Currency exchange rate provider
  CURRENCY_PROVIDER: Joi.string().valid('fake', 'open_exchange_rates').default('fake'),
  CURRENCY_CACHE_TTL_SECS: Joi.number().integer().min(60).default(3600),
});
