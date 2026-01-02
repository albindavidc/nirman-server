export class MemberResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  userStatus: string;
  // Professional fields
  professionalTitle?: string;
  experienceYears?: number;
  skills?: string[];
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MemberListResponseDto {
  data: MemberResponseDto[];
  total: number;
  page: number;
  limit: number;
}
