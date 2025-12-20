import { Command } from '@nestjs/cqrs';
import { ProfileResponseDto } from '../dto/profile.response.dto';

export class UpdateProfileCommand extends Command<ProfileResponseDto> {
  constructor(
    public readonly userId: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly phoneNumber?: string,
    public readonly profilePhotoUrl?: string,
  ) {
    super();
  }
}
