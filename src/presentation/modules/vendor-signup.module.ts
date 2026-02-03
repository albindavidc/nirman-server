import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { UserRepository } from '../../infrastructure/persistence/repositories/user/user.repository';
import { VendorRepository } from '../../infrastructure/persistence/repositories/vendor/vendor.repository';
import { EmailService } from '../../infrastructure/services/email/email.service';

// Domain interfaces
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import { VENDOR_REPOSITORY } from '../../domain/repositories/vendor-repository.interface';
import { EMAIL_SERVICE } from '../../application/interfaces/email-service.interface';

// Controllers
import { VendorSignupController } from '../controllers/vendor-signup.controller';

// Command Handlers
import { CreateVendorUserHandler } from '../../application/handlers/commands/vendor/create-vendor-user.handler';
import { CreateVendorCompanyHandler } from '../../application/handlers/commands/vendor/create-vendor-company.handler';

// Event Handlers
import { UserRegisteredHandler } from '../../application/handlers/events/user-registered.handler';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [VendorSignupController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: VENDOR_REPOSITORY, useClass: VendorRepository },
    { provide: EMAIL_SERVICE, useClass: EmailService },
    CreateVendorUserHandler,
    CreateVendorCompanyHandler,
    UserRegisteredHandler,
  ],
})
export class VendorSignupModule {}
