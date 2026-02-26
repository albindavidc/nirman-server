export class WorkHours {
  static fromNumber(workHours: number): WorkHours | null {
    if (workHours < 0) {
      return null;
    }
    return new WorkHours(workHours);
  }
  private constructor(public readonly value: number) {
    if (value < 0) {
      throw new Error('Work hours cannot be negative');
    }
  }
  static of(hours: number): WorkHours {
    return new WorkHours(Math.round(hours * 10) / 10);
  }

  static calculate(checkIn: Date, checkOut: Date): WorkHours {
    const ms = checkOut.getTime() - checkIn.getTime();
    const hours = ms / (1000 * 60 * 60);
    return WorkHours.of(hours);
  }

  isHalfDay(): boolean {
    return this.value < 4;
  }

  isFullDay(): boolean {
    return this.value >= 4;
  }

  toString(): string {
    return `${this.value} hours`;
  }
}
