import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { VendorRepository } from 'src/infrastructure/repositories/vendor.repository';
import { VendorSignupController } from 'src/presentation/controllers/vendor-signup.controller';
import { CreateVendorUserHandler } from 'src/application/handlers/command/create-vendor-user.handler';
import { CreateVendorCompanyHandler } from 'src/application/handlers/command/create-vendor-company.handler';

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
