import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Infrastructure
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';

// Common - Security
import { JwtAuthGuard } from './common/security/guards/jwt-auth.guard';
import { RolesGuard } from './common/security/guards/roles.guard';

// Presentation Modules
import { VendorSignupModule } from './presentation/modules/vendor-signup.module';
import { OtpModule } from './presentation/modules/otp.module';
import { AuthModule } from './presentation/modules/auth.module';
import { VendorManagementModule } from './presentation/modules/vendor.module';
import { ProfileModule } from './presentation/modules/profile.module';
import { UploadModule } from './presentation/modules/upload.module';
import { MemberModule } from './presentation/modules/member.module';

@Module({
  imports: [
    PrismaModule,
    VendorSignupModule,
    OtpModule,
    AuthModule,
    VendorManagementModule,
    ProfileModule,
    UploadModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
