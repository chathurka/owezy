export const env = {
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? 'dev',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET ?? '',
} as const;
