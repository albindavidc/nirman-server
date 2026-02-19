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

  constructor(partial: Partial<MemberResponseDto>) {
    this.id = partial.id ?? '';
    this.firstName = partial.firstName ?? '';
    this.lastName = partial.lastName ?? '';
    this.email = partial.email ?? '';
    this.phoneNumber = partial.phoneNumber;
    this.role = partial.role ?? '';
    this.userStatus = partial.userStatus ?? '';
    this.professionalTitle = partial.professionalTitle;
    this.experienceYears = partial.experienceYears;
    this.skills = partial.skills;
    this.addressStreet = partial.addressStreet;
    this.addressCity = partial.addressCity;
    this.addressState = partial.addressState;
    this.addressZipCode = partial.addressZipCode;
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
  }
}

export class MemberListResponseDto {
  data: MemberResponseDto[];
  total: number;
  page: number;
  limit: number;

  constructor(partial: Partial<MemberListResponseDto>) {
    this.data = partial.data ?? [];
    this.total = partial.total ?? 0;
    this.page = partial.page ?? 0;
    this.limit = partial.limit ?? 0;
  }
}
