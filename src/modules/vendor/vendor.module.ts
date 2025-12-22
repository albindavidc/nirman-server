import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VendorManagementController } from 'src/modules/vendor/presentation/vendor-management.controller';
import { GetVendorsHandler } from 'src/modules/vendor/application/handlers/get-vendors.handler';
import { UpdateVendorHandler } from 'src/modules/vendor/application/handlers/update-vendor.handler';

import { GetVendorByIdHandler } from 'src/modules/vendor/application/handlers/get-vendor-by-id.handler';

import { UnblacklistVendorHandler } from './application/handlers/unblacklist-vendor.handler';

const QueryHandlers = [GetVendorsHandler, GetVendorByIdHandler];
const CommandHandlers = [UpdateVendorHandler, UnblacklistVendorHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [VendorManagementController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class VendorManagementModule {}
