import { User } from '../../domain/entities/user.entity';

export type RepoUser = Pick<User, 'id' | 'email' | 'role'> & {
  first_name: User['firstName'];
  last_name: User['lastName'];
  phone_number: User['phoneNumber'];
  is_phone_verified: User['isPhoneVerified'];
  is_email_verified: User['isEmailVerified'];
  date_of_birth: User['dateOfBirth'];
  profile_photo_url: User['profilePhotoUrl'];
  user_status: User['userStatus'];
  created_at: User['createdAt'];
  updated_at: User['updatedAt'];
};

export interface AttendanceBase {
  id: string;
  project_id: string;
  user_id: string;
  date: Date;
  check_in: Date | null;
  check_out: Date | null;
  status: string;
  location: string | null;
  work_hours: number | null;
  method: string;
  supervisor_notes: string | null;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface AttendancePersistence extends AttendanceBase {
  user?: RepoUser;
}

export type PrismaAttendance = AttendancePersistence;

export interface AttendanceWherePersistenceInput {
  project_id?: string;
  user_id?: string;
  date?: {
    gte?: Date;
    lte?: Date;
  };
  id?: string;
}

export type AttendanceCreatePersistenceInput = Omit<
  AttendanceBase,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'supervisor_notes'
  | 'is_verified'
  | 'verified_by'
  | 'verified_at'
>;

export type AttendanceUpdatePersistenceInput = Partial<
  Omit<
    AttendanceBase,
    'id' | 'created_at' | 'updated_at' | 'project_id' | 'user_id' | 'date'
  >
>;
