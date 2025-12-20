import { Query } from '@nestjs/cqrs';
import { ProfileResponseDto } from '../dto/profile.response.dto';

export class GetProfileQuery extends Query<ProfileResponseDto> {
  constructor(public readonly userId: string) {
    super();
  }
}
