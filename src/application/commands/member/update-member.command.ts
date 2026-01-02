import { UpdateMemberDto } from '../../dto/member/update-member.dto';

export class UpdateMemberCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateMemberDto,
  ) {}
}
