import { z } from 'zod';

const envSchema = z.object({
  // Database
  POSTGRES_URL: z.string().url(),

  // Auth
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  AUTH_URL: z.string().url().optional(),

  // Email (optional for now)
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse({
    POSTGRES_URL: process.env.POSTGRES_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    console.error(error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  throw error;
}

export { env };
