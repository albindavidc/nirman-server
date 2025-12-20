import { Command } from '@nestjs/cqrs';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberResponseDto } from '../dto/member.response.dto';

export class AddMemberCommand extends Command<MemberResponseDto> {
  constructor(public readonly dto: CreateMemberDto) {
    super();
  }
}
