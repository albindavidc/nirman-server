import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { GetProfileQuery } from 'src/application/queries/get-profile.query';
import { UpdateProfileCommand } from 'src/application/commands/update-profile.command';
import { UpdatePasswordCommand } from 'src/application/commands/update-password.command';

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
  async updateProfile(@Request() req: any, @Body() dto: any) {
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
  async updatePassword(@Request() req: any, @Body() dto: any) {
    return this.commandBus.execute(
      new UpdatePasswordCommand(
        req.user.userId,
        dto.currentPassword,
        dto.newPassword,
      ),
    );
  }
}
