import { Query } from '@nestjs/cqrs';
import { ProfileResponseDto } from '../../dto/profile/profile.response.dto';

export class GetProfileQuery extends Query<ProfileResponseDto> {
  constructor(public readonly userId: string) {
    super();
  }
}
