import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from 'src/modules/user/infrastructure/persistence/user.repository';
import { VendorRepository } from 'src/modules/vendor/infrastructure/persistence/vendor.repository';
import { USER_REPOSITORY } from 'src/modules/user/domain/repositories/user-repository.interface';
import { VENDOR_REPOSITORY } from 'src/modules/vendor/domain/repositories/vendor-repository.interface';
import { VendorSignupController } from 'src/modules/vendor/presentation/vendor-signup.controller';
import { CreateVendorUserHandler } from 'src/modules/vendor/application/handlers/create-vendor-user.handler';
import { CreateVendorCompanyHandler } from 'src/modules/vendor/application/handlers/create-vendor-company.handler';

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
