export class MemberDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  userStatus: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  professionalTitle: string | null;
  experienceYears: number | null;
  skills: string[];
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZipCode: string | null;
}

export class PaginatedMembersResponseDto {
  data: MemberDto[];
  total: number;
  page: number;
  limit: number;
}
