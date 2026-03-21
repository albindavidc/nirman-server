import { Command } from '@nestjs/cqrs';
import { Role } from '../../../domain/enums/role.enum';
import { CreateUserDto } from '../../dto/user/create-user.dto';

export class CreateUserCommand extends Command<string> {
  constructor(
    public readonly dto: CreateUserDto,
    public readonly role: Role,
  ) {
    super();
  }
}
