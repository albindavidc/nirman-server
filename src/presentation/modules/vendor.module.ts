import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { VendorRepository } from '../../infrastructure/persistence/repositories/vendor/vendor.repository';

// Domain interfaces
import { VENDOR_REPOSITORY } from '../../domain/repositories/vendor-repository.interface';

// Controllers
import { VendorManagementController } from '../controllers/vendor-management.controller';

// Query Handlers
import { GetVendorsHandler } from '../../application/handlers/queries/vendor/get-vendors.handler';
import { GetVendorByIdHandler } from '../../application/handlers/queries/vendor/get-vendor-by-id.handler';

// Command Handlers
import { UpdateVendorHandler } from '../../application/handlers/commands/vendor/update-vendor.handler';
import { UnblacklistVendorHandler } from '../../application/handlers/commands/vendor/unblacklist-vendor.handler';
import { RejectVendorHandler } from '../../application/handlers/commands/vendor/reject-vendor.handler';
import { RequestRecheckHandler } from '../../application/handlers/commands/vendor/request-recheck.handler';

const QueryHandlers = [GetVendorsHandler, GetVendorByIdHandler];
const CommandHandlers = [
  UpdateVendorHandler,
  UnblacklistVendorHandler,
  RejectVendorHandler,
  RequestRecheckHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [VendorManagementController],
  providers: [
    { provide: VENDOR_REPOSITORY, useClass: VendorRepository },
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class VendorManagementModule {}
