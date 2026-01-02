import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { UserRepository } from '../../infrastructure/persistence/repositories/user/user.repository';
import { VendorRepository } from '../../infrastructure/persistence/repositories/vendor/vendor.repository';

// Domain interfaces
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import { VENDOR_REPOSITORY } from '../../domain/repositories/vendor-repository.interface';

// Controllers
import { VendorSignupController } from '../controllers/vendor-signup.controller';

// Handlers
import { CreateVendorUserHandler } from '../../application/handlers/commands/vendor/create-vendor-user.handler';
import { CreateVendorCompanyHandler } from '../../application/handlers/commands/vendor/create-vendor-company.handler';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [VendorSignupController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: VENDOR_REPOSITORY, useClass: VendorRepository },
    CreateVendorUserHandler,
    CreateVendorCompanyHandler,
  ],
})
export class VendorSignupModule {}
