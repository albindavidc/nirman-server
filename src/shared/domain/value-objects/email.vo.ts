//src/shared/infrastructure/common/filters/domain/value-objects/email.vo.ts

export class EmailVO {
  private readonly value: string;
  constructor(email: string) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email');
    }
    this.value = email;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: EmailVO): boolean {
    return this.value === other.value;
  }
}
