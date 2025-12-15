import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from './prisma/prisma.module';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { VendorRepository } from './infrastructure/repositories/vendor.repository';
import { VendorSignupController } from './presentation/controllers/vendor-signup.controller';
import { CreateVendorUserHandler } from './application/handlers/command/create-vendor-user.handler';
import { CreateVendorCompanyHandler } from './application/handlers/command/create-vendor-company.handler';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [VendorSignupController],
  providers: [
    UserRepository,
    VendorRepository,
    CreateVendorUserHandler,
    CreateVendorCompanyHandler,
  ],
})
export class VendorSignupModule {}
