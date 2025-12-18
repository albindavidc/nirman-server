import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { VendorSignupModule } from './modules/vendor-signup.module';
import { OtpModule } from './modules/otp.module';
import { AuthModule } from './modules/auth.module';
import { VendorManagementModule } from './modules/vendor-management.module';
import { MemberManagementModule } from './modules/member-management.module';
import { ProfileModule } from './modules/profile.module';

@Module({
  imports: [
    PrismaModule,
    VendorSignupModule,
    OtpModule,
    AuthModule,
    VendorManagementModule,
    MemberManagementModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
