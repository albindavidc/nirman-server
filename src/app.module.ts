import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { VendorSignupModule } from './modules/vendor/vendor-signup.module';
import { OtpModule } from './modules/otp/otp.module';
import { AuthModule } from './modules/auth/auth.module';
import { VendorManagementModule } from './modules/vendor/vendor.module';
import { MemberManagementModule } from './modules/member/member.module';
import { ProfileModule } from './modules/profile/profile.module';

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
