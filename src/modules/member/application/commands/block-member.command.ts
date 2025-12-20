import { Command } from '@nestjs/cqrs';
import { MemberResponseDto } from '../dto/member.response.dto';

export class BlockMemberCommand extends Command<MemberResponseDto> {
  constructor(
    public readonly id: string,
    public readonly isBlocked: boolean,
  ) {
    super();
  }
}
