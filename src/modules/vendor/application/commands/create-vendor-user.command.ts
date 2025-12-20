import { Command } from '@nestjs/cqrs';
import { CreateVendorUserDto } from '../dto/create-vendor-user.dto';

export class CreateVendorUserCommand extends Command<string> {
  constructor(public readonly dto: CreateVendorUserDto) {
    super();
  }
}
