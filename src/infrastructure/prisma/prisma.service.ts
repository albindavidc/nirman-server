import { PrismaClient } from '../../generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required for Supabase
      max: 10, // max connections in pool
      idleTimeoutMillis: 30000, // close idle connections after 30s
    });

    super({
      adapter: new PrismaPg(pool),
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('🚀 Prisma connected to PostgreSQL');
    } catch (error) {
      this.logger.error('❌ Prisma connection failed:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🛑 Prisma disconnected');
  }
}
