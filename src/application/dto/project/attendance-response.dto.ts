export interface AttendanceResponseDto {
  id: string;
  workerId: string;
  workerName: string;
  workerRole: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  location?: string;
  workHours?: number;
  method: string;
  supervisorNotes?: string | null;
  isVerified: boolean;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
}
