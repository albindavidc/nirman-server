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

export interface PrismaAttendance {
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
  user?: RepoUser;
}
