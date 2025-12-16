import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VendorManagementController } from 'src/presentation/controllers/vendor-management.controller';
import { GetVendorsHandler } from 'src/application/handlers/query/get-vendors.handler';
import { UpdateVendorHandler } from 'src/application/handlers/command/update-vendor.handler';

const QueryHandlers = [GetVendorsHandler];
const CommandHandlers = [UpdateVendorHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [VendorManagementController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class VendorManagementModule {}
