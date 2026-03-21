import { Command } from '@nestjs/cqrs';
import { CreateMemberDto } from '../../dto/member/create-member.dto';

export class CreateMemberCommand extends Command<any> {
  constructor(public readonly data: CreateMemberDto) {
    super();
  }
}
