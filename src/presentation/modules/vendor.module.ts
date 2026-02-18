import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { VendorRepository } from '../../infrastructure/repositories/vendor.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

// Domain interfaces
import { VENDOR_REPOSITORY } from '../../domain/repositories/vendor-repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';

// Controllers
import { VendorManagementController } from '../controllers/vendor-management.controller';

// Query Handlers
import { GetVendorsHandler } from '../../application/handlers/queries/vendor/get-vendors.handler';
import { GetVendorByIdHandler } from '../../application/handlers/queries/vendor/get-vendor-by-id.handler';

// Command Handlers
import { CreateVendorByAdminHandler } from '../../application/handlers/commands/vendor/create-vendor-by-admin.handler';
import { UpdateVendorHandler } from '../../application/handlers/commands/vendor/update-vendor.handler';
import { UnblacklistVendorHandler } from '../../application/handlers/commands/vendor/unblacklist-vendor.handler';
import { RejectVendorHandler } from '../../application/handlers/commands/vendor/reject-vendor.handler';
import { RequestRecheckHandler } from '../../application/handlers/commands/vendor/request-recheck.handler';

const QueryHandlers = [GetVendorsHandler, GetVendorByIdHandler];
const CommandHandlers = [
  CreateVendorByAdminHandler,
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
    { provide: USER_REPOSITORY, useClass: UserRepository },
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class VendorManagementModule {}
