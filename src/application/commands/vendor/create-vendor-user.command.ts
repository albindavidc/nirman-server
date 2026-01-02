import { Command } from '@nestjs/cqrs';
import { CreateVendorUserDto } from '../../dto/vendor/create-vendor-user.dto';

export class CreateVendorUserCommand extends Command<string> {
  constructor(public readonly dto: CreateVendorUserDto) {
    super();
  }
}
