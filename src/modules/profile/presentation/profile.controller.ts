import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/jwt-auth.guard';
import { GetProfileQuery } from 'src/modules/profile/application/queries/get-profile.query';
import { UpdateProfileCommand } from 'src/modules/profile/application/commands/update-profile.command';
import { UpdatePasswordCommand } from 'src/modules/profile/application/commands/update-password.command';
import { UpdateProfileDto } from '../application/dto/update-profile.dto';
import { UpdatePasswordDto } from '../application/dto/update-password.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getProfile(@Request() req: any) {
    return this.queryBus.execute(new GetProfileQuery(req.user.userId));
  }

  @Put()
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.commandBus.execute(
      new UpdateProfileCommand(
        req.user.userId,
        dto.firstName,
        dto.lastName,
        dto.phoneNumber,
        dto.profilePhotoUrl,
      ),
    );
  }

  @Put('password')
  async updatePassword(@Request() req: any, @Body() dto: UpdatePasswordDto) {
    return this.commandBus.execute(
      new UpdatePasswordCommand(
        req.user.userId,
        dto.currentPassword,
        dto.newPassword,
      ),
    );
  }
}
