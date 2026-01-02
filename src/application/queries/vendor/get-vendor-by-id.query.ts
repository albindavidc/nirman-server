import { IQuery } from '@nestjs/cqrs';

export class GetVendorByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
