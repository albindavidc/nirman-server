import 'dotenv/config';
import type { PrismaConfig } from 'prisma/config';
import { env } from 'prisma/config';

export default {
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DIRECT_URL'),
  },
} satisfies PrismaConfig;
