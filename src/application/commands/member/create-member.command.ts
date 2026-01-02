import { CreateMemberDto } from '../../dto/member/create-member.dto';

export class CreateMemberCommand {
  constructor(public readonly data: CreateMemberDto) {}
}
