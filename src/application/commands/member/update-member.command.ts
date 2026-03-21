import { Command } from '@nestjs/cqrs';
import { UpdateMemberDto } from '../../dto/member/update-member.dto';

export class UpdateMemberCommand extends Command<any> {
  constructor(
    public readonly id: string,
    public readonly data: UpdateMemberDto,
  ) {
    super();
  }
}
