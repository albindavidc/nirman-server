import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendOtpDto, VerifyOtpDto } from '../../application/dto/otp/otp.dto';
import { SendOtpCommand } from '../../application/commands/otp/send-otp.command';
import { VerifyOtpCommand } from '../../application/commands/otp/verify-otp.command';
import { Public } from '../../common/security/decorators/public.decorator';

import { OTP_ROUTES } from '../../common/constants/routes.constants';

@Controller(OTP_ROUTES.ROOT)
export class OtpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post(OTP_ROUTES.SEND)
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    const result = await this.commandBus.execute(new SendOtpCommand(dto));
    return {
      message: result.message,
      email: dto.email,
    };
  }

  @Public()
  @Post(OTP_ROUTES.VERIFY)
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const result = await this.commandBus.execute(new VerifyOtpCommand(dto));
    return {
      message: result.message,
      verified: result.verified,
    };
  }

  @Public()
  @Post(OTP_ROUTES.RESEND)
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() dto: SendOtpDto) {
    // Resend is same as send - it will generate a new OTP
    await this.commandBus.execute(new SendOtpCommand(dto));
    return {
      message: 'OTP resent successfully',
      email: dto.email,
    };
  }
}
