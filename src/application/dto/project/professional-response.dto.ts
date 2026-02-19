export class ProfessionalResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  profilePhoto: string | null;
  title: string;
  experienceYears: number;
  skills: string[];

  constructor(partial: Partial<ProfessionalResponseDto>) {
    this.id = partial.id ?? '';
    this.firstName = partial.firstName ?? '';
    this.lastName = partial.lastName ?? '';
    this.fullName = partial.fullName ?? '';
    this.email = partial.email ?? '';
    this.phone = partial.phone ?? null;
    this.profilePhoto = partial.profilePhoto ?? null;
    this.title = partial.title ?? '';
    this.experienceYears = partial.experienceYears ?? 0;
    this.skills = partial.skills ?? [];
  }
}
