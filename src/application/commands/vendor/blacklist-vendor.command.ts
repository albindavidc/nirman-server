import { ICommand } from '@nestjs/cqrs';

export class BlacklistVendorCommand implements ICommand {
  constructor(public readonly id: string) {}
}
