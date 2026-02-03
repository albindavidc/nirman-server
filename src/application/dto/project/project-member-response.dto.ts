export class ProjectMemberResponseDto {
  userId: string;
  role: string;
  joinedAt: Date;
  isCreator: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string | null;
    profilePhoto: string | null;
    title: string;
  } | null;
}
