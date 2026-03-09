import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../../application/dto/user/create-user.dto';
import { CreateUserCommand } from '../../application/commands/user/create-user.command';
import { CreateVendorCompanyDto } from '../../application/dto/vendor/create-vendor-company.dto';
import { CreateVendorCompanyCommand } from '../../application/commands/vendor/create-vendor-company.command';
import { Public } from '../../common/security/decorators/public.decorator';

import { VENDOR_SIGNUP_ROUTES } from '../../common/constants/routes.constants';
import { Role } from '../../domain/enums/role.enum';

@Controller(VENDOR_SIGNUP_ROUTES.ROOT)
export class VendorSignupController {
  constructor(private commandBus: CommandBus) {}

  //User Info
  @Public()
  @Post(VENDOR_SIGNUP_ROUTES.STEP_1)
  @UsePipes(new ValidationPipe({ transform: true }))
  async step1(@Body() dto: CreateUserDto) {
    const userId = await this.commandBus.execute(
      new CreateUserCommand(dto, Role.VENDOR),
    );
    return {
      message: 'User created successfully',
      userId,
      nextStep: 'company-details',
    };
  }


  //Company Details
  @Public()
  @Post(VENDOR_SIGNUP_ROUTES.STEP_2)
  @UsePipes(new ValidationPipe({ transform: true }))
  async step2(@Body() dto: CreateVendorCompanyDto) {
    const vendorId = await this.commandBus.execute(
      new CreateVendorCompanyCommand(dto, dto.userId),
    );
    return { message: 'Vendor signup completed', vendorId };
  }
}
