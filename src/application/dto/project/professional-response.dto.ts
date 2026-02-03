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
}
