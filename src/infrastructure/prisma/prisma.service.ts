import { PrismaClient } from 'src/generated/client/client';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';

import 'dotenv/config'; // Ensure env vars are loaded

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('🚀 Prisma connected to MongoDB');
    } catch (error) {
      this.logger.error('❌ Prisma connection failed:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🛑 Prisma disconnected');
  }
}
