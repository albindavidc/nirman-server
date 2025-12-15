import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateVendorUserDto } from '../../application/dto/create-vendor-user.dto';
import { CreateVendorUserCommand } from '../../application/command/create-vendor-user.command';
import { CreateVendorCompanyDto } from '../../application/dto/create-vendor-company.dto';
import { CreateVendorCompanyCommand } from '../../application/command/create-vendor-company.command';

@Controller('auth/vendor/signup')
export class VendorSignupController {
  constructor(private commandBus: CommandBus) {}

  @Post('step1') // User info
  @UsePipes(new ValidationPipe({ transform: true }))
  async step1(@Body() dto: CreateVendorUserDto) {
    const userId = await this.commandBus.execute(
      new CreateVendorUserCommand(dto),
    );
    return {
      message: 'User created successfully',
      userId,
      nextStep: 'company-details',
    };
    // Frontend can store userId in session/localStorage for step2
  }

  @Post('step2') // Company details
  @UsePipes(new ValidationPipe({ transform: true }))
  async step2(@Body() dto: CreateVendorCompanyDto) {
    const vendorId = await this.commandBus.execute(
      new CreateVendorCompanyCommand(dto, dto.userId),
    );
    return { message: 'Vendor signup completed', vendorId };
    // Here, generate JWT or complete flow
  }
}
