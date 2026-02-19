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

  constructor(partial: Partial<ProjectMemberResponseDto>) {
    this.userId = partial.userId ?? '';
    this.role = partial.role ?? '';
    this.joinedAt = partial.joinedAt ?? new Date();
    this.isCreator = partial.isCreator ?? false;
    this.user = partial.user ?? null;
  }
}
