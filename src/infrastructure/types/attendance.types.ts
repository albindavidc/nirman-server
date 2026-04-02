import { User } from '../../domain/entities/user.entity';

export type RepoUser = {
  id: User['id'];
  email: User['email'];
  role: User['role'];
  firstName: User['firstName'];
  lastName: User['lastName'];
  phoneNumber: User['phoneNumber'];
  isPhoneVerified: User['isPhoneVerified'];
  isEmailVerified: User['isEmailVerified'];
  dateOfBirth: User['dateOfBirth'];
  profilePhotoUrl: User['profilePhotoUrl'];
  userStatus: User['userStatus'];
  createdAt: User['createdAt'];
  updatedAt: User['updatedAt'];
};

export interface AttendanceBase {
  id: string;
  projectId: string;
  userId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: string;
  location: string | null;
  workHours: number | null;
  method: string;
  supervisorNotes: string | null;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AttendancePersistence extends AttendanceBase {
  user?: RepoUser;
}

export type PrismaAttendance = AttendancePersistence;

export interface AttendanceWherePersistenceInput {
  projectId?: string;
  userId?: string;
  date?: {
    gte?: Date;
    lte?: Date;
  };
  id?: string;
}

export type AttendanceCreatePersistenceInput = Omit<
  AttendanceBase,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'supervisorNotes'
  | 'isVerified'
  | 'verifiedBy'
  | 'verifiedAt'
>;

export type AttendanceUpdatePersistenceInput = Partial<
  Omit<
    AttendanceBase,
    'id' | 'createdAt' | 'updatedAt' | 'projectId' | 'userId' | 'date'
  >
>;
