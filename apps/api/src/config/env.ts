import { resolve } from 'node:path';
import { z } from 'zod';

const optionalString = z.preprocess(
  value => (value === '' ? undefined : value),
  z.string().optional()
);

const optionalCsv = z.preprocess(
  value => {
    if (typeof value !== 'string') return value;
    const items = value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    return items.length > 0 ? items : undefined;
  },
  z.array(z.string().url()).optional()
);

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    FRONTEND_URL: z.string().url().default('http://localhost:3001'),
    DATABASE_URL: z
      .string()
      .min(1, 'DATABASE_URL is required')
      .refine(value => value.startsWith('postgresql://') || value.startsWith('postgres://'), {
        message: 'DATABASE_URL must be a PostgreSQL connection string',
      }),
    AI_PROVIDER: z.enum(['mock', 'openai']).default('mock'),
    OPENAI_API_KEY: optionalString,
    OPENAI_MODEL: z.string().default('gpt-4o-mini'),
    CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
    CLERK_AUTHORIZED_PARTIES: optionalCsv,
    RESEND_API_KEY: optionalString,
    EMAIL_FROM: optionalString,
    GITHUB_APP_ID: optionalString,
    GITHUB_APP_CLIENT_ID: optionalString,
    GITHUB_APP_PRIVATE_KEY: optionalString,
    GITHUB_APP_INSTALLATION_URL: optionalString,
    GITHUB_APP_CALLBACK_URL: optionalString,
    GITHUB_APP_WEBHOOK_SECRET: optionalString,
  })
  .superRefine((env, context) => {
    if (env.AI_PROVIDER === 'openai' && !env.OPENAI_API_KEY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['OPENAI_API_KEY'],
        message: 'OPENAI_API_KEY is required when AI_PROVIDER=openai',
      });
    }

    const githubValues = [
      env.GITHUB_APP_ID,
      env.GITHUB_APP_CLIENT_ID,
      env.GITHUB_APP_PRIVATE_KEY,
      env.GITHUB_APP_INSTALLATION_URL,
      env.GITHUB_APP_CALLBACK_URL,
    ];
    const hasPartialGithubConfig = githubValues.some(Boolean);
    const hasCompleteGithubConfig = githubValues.every(Boolean);

    if (hasPartialGithubConfig && !hasCompleteGithubConfig) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['GITHUB_APP_ID'],
        message:
          'GitHub App connection requires GITHUB_APP_ID, GITHUB_APP_CLIENT_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_APP_INSTALLATION_URL, and GITHUB_APP_CALLBACK_URL',
      });
    }
  });

export type ApiEnv = z.infer<typeof envSchema>;

export const apiEnvFilePath = resolve(process.cwd(), '.env');

export function validateEnv(config: Record<string, unknown>): ApiEnv {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid API environment configuration. ${details}`);
  }

  return parsed.data;
}

export function describeDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);

  return {
    host: url.hostname,
    port: url.port || '5432',
    database: url.pathname.replace(/^\//, '') || '(none)',
    passwordPresent: Boolean(url.password),
  };
}
