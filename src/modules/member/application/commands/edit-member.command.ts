import { Command } from '@nestjs/cqrs';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { UserPersistence } from 'src/modules/user/domain/repositories/user-repository.interface';

export class EditMemberCommand extends Command<UserPersistence> {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateMemberDto,
  ) {
    super();
  }
}
