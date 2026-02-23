export class WorkerResponseDto {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber?: string;
  role!: string;
  userStatus!: string;
  professionalTitle?: string;
  experienceYears?: number;
  skills?: string[];
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class WorkerListResponseDto {
  data!: WorkerResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
}
