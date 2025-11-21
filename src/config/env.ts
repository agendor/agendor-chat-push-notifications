import dotenv from 'dotenv';

dotenv.config();

const number = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: number(process.env.PORT, 3000),
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: number(process.env.DATABASE_PORT, 5432),
    username: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'p7HWd2DsbL',
    database: process.env.DATABASE_NAME ?? 'ac_push_notifications',
  },
  databaseUrl:
    process.env.DATABASE_URL ??
    `postgresql://${process.env.DATABASE_USER ?? 'postgres'}:${process.env.DATABASE_PASSWORD ?? 'p7HWd2DsbL'}@${process.env.DATABASE_HOST ?? 'localhost'}:${process.env.DATABASE_PORT ?? 5432}/${process.env.DATABASE_NAME ?? 'ac_push_notifications'}`,
};
