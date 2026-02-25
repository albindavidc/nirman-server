export enum AttendanceValue {
  ON_TIME = 'ON_TIME',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  ON_LEAVE = 'ON_LEAVE',
}

export class AttendanceStatus {
  static readonly ON_TIME = new AttendanceStatus(AttendanceValue.ON_TIME);
  static readonly LATE = new AttendanceStatus(AttendanceValue.LATE);
  static readonly ABSENT = new AttendanceStatus(AttendanceValue.ABSENT);
  static readonly ON_LEAVE = new AttendanceStatus(AttendanceValue.ON_LEAVE);

  private constructor(public readonly value: AttendanceValue) {}

  static isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  static fromString(value: string): AttendanceStatus {
    if (Object.values(AttendanceValue).includes(value as AttendanceValue)) {
      return new AttendanceStatus(value as AttendanceValue);
    }
    throw new Error(`Invalid attendance status: ${value}`);
  }

  /**
   * Business rule: 15 minutes grace period for being late
   */
  static determineFromCheckInTime(
    checkIn: Date,
    workStartHours = 8,
    graceMinutes = 15,
  ): AttendanceStatus {
    if (!this.isToday(checkIn)) {
      throw new Error('Check-in time must be for today');
    }

    const lateThreshold = new Date(checkIn);
    lateThreshold.setHours(workStartHours, graceMinutes, 0, 0);

    return checkIn > lateThreshold
      ? AttendanceStatus.LATE
      : AttendanceStatus.ON_TIME;
  }
}
