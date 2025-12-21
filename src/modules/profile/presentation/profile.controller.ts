import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/jwt-auth.guard';
import { GetProfileQuery } from 'src/modules/profile/application/queries/get-profile.query';
import { UpdateProfileCommand } from 'src/modules/profile/application/commands/update-profile.command';
import { UpdatePasswordCommand } from 'src/modules/profile/application/commands/update-password.command';
import { UpdateProfileDto } from '../application/dto/update-profile.dto';
import { UpdatePasswordDto } from '../application/dto/update-password.dto';
import { ProfileResponseDto } from '../application/dto/profile.response.dto';
import { AuthenticatedRequest } from 'src/modules/auth/application/interfaces/authenticated-request.interface';

import { PROFILE_ROUTES } from 'src/app.routes';

@Controller(PROFILE_ROUTES.ROOT)
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(PROFILE_ROUTES.GET_PROFILE)
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ProfileResponseDto> {
    return this.queryBus.execute<ProfileResponseDto>(
      new GetProfileQuery(req.user.userId),
    );
  }

  @Put(PROFILE_ROUTES.UPDATE_PROFILE)
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.commandBus.execute<ProfileResponseDto>(
      new UpdateProfileCommand(
        req.user.userId,
        dto.firstName,
        dto.lastName,
        dto.phoneNumber,
        dto.profilePhotoUrl,
      ),
    );
  }

  @Put(PROFILE_ROUTES.UPDATE_PASSWORD)
  async updatePassword(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    return this.commandBus.execute<{ message: string }>(
      new UpdatePasswordCommand(
        req.user.userId,
        dto.currentPassword,
        dto.newPassword,
      ),
    );
  }
}
