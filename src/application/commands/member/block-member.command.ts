import { Command } from '@nestjs/cqrs';

export class BlockMemberCommand extends Command<any> {
  constructor(public readonly id: string) {
    super();
  }
}

export class UnblockMemberCommand extends Command<any> {
  constructor(public readonly id: string) {
    super();
  }
}
