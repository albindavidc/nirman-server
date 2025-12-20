import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  SendOtpDto,
  VerifyOtpDto,
} from 'src/modules/otp/application/dto/otp.dto';
import { SendOtpCommand } from 'src/modules/otp/application/commands/send-otp.command';
import { VerifyOtpCommand } from 'src/modules/otp/application/commands/verify-otp.command';

@Controller('auth/otp')
export class OtpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    const result = await this.commandBus.execute(new SendOtpCommand(dto));
    return {
      message: result.message,
      email: dto.email,
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const result = await this.commandBus.execute(new VerifyOtpCommand(dto));
    return {
      message: result.message,
      verified: result.verified,
    };
  }

  @Post('resend')
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
