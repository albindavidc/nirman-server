export class AttendanceRecordDto {
  id: string;
  userId: string;
  projectId: string;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  status: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  workHours?: number;
  isVerified: boolean;
  supervisorNotes?: string;
}

export class AttendanceStatsDto {
  hoursThisWeek: number;
  hoursThisMonth: number;
  attendanceRate: number;
  lateArrivals: number;
}

export class ProjectAttendanceStatsDto {
  attendanceRate: number;
  presentToday: number;
  lateArrivals: number;
  absent: number;
}
