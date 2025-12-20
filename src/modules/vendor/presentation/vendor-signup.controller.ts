import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateVendorUserDto } from 'src/modules/vendor/application/dto/create-vendor-user.dto';
import { CreateVendorUserCommand } from 'src/modules/vendor/application/commands/create-vendor-user.command';
import { CreateVendorCompanyDto } from 'src/modules/vendor/application/dto/create-vendor-company.dto';
import { CreateVendorCompanyCommand } from 'src/modules/vendor/application/commands/create-vendor-company.command';

@Controller('auth/vendor/signup')
export class VendorSignupController {
  constructor(private commandBus: CommandBus) {}

  //User Info
  @Post('step1')
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
  }

  //Company Details
  @Post('step2')
  @UsePipes(new ValidationPipe({ transform: true }))
  async step2(@Body() dto: CreateVendorCompanyDto) {
    const vendorId = await this.commandBus.execute(
      new CreateVendorCompanyCommand(dto, dto.userId),
    );
    return { message: 'Vendor signup completed', vendorId };
  }
}
