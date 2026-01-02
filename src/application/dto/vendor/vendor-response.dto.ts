export class VendorResponseDto {
  id: string;
  userId: string;
  companyName: string;
  registrationNumber: string;
  taxNumber: string;
  yearsInBusiness: number;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZipCode: string;
  productsServices: string[];
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  vendorStatus: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  rating?: number;
  orders?: number;
  onTimeDelivery?: number;
}
