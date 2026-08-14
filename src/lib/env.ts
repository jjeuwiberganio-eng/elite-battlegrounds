function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  DATABASE_URL: getEnv("DATABASE_URL"),

  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

  NEXTAUTH_URL: process.env.NEXTAUTH_URL,

  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,

  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,

  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;