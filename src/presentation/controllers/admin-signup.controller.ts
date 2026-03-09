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
import { Public } from '../../common/security/decorators/public.decorator';
import { AUTH_ROUTES } from '../../common/constants/routes.constants';
import { Role } from '../../domain/enums/role.enum';

@Controller(AUTH_ROUTES.ROOT)
export class AdminSignupController {
  constructor(private commandBus: CommandBus) {}

  @Public()
  @Post(AUTH_ROUTES.ADMIN_SIGNUP)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() dto: CreateUserDto) {
    const userId = await this.commandBus.execute(
      new CreateUserCommand(dto, Role.ADMIN),
    );
    return {
      message: 'Admin created successfully',
      userId,
    };
  }
}
