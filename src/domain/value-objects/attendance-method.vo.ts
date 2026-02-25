export enum AttendanceMethodValue {
  QR_CODE = 'QR_CODE',
  MANUAL = 'MANUAL',
  GEOFENCE = 'GEOFENCE',
}

export class AttendanceMethod {
  static readonly QR_CODE = new AttendanceMethod(AttendanceMethodValue.QR_CODE);
  static readonly MANUAL = new AttendanceMethod(AttendanceMethodValue.MANUAL);
  static readonly GEOFENCE = new AttendanceMethod(
    AttendanceMethodValue.GEOFENCE,
  );

  private constructor(public readonly value: string) {}

  static fromString(value: string): AttendanceMethod {
    if (
      Object.values(AttendanceMethodValue).includes(
        value as AttendanceMethodValue,
      )
    ) {
      return new AttendanceMethod(value as AttendanceMethodValue);
    }
    throw new Error(`Invalid attendance method: ${value}`);
  }

  toString(): string {
    return this.value;
  }
}
