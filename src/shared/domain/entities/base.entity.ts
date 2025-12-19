import { AggregateRoot } from '@nestjs/cqrs';

export abstract class BaseEntity extends AggregateRoot {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    super();
    this.id = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
