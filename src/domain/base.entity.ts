export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
