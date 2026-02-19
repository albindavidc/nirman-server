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

  constructor(partial: Partial<VendorResponseDto>) {
    this.id = partial.id ?? '';
    this.userId = partial.userId ?? '';
    this.companyName = partial.companyName ?? '';
    this.registrationNumber = partial.registrationNumber ?? '';
    this.taxNumber = partial.taxNumber ?? '';
    this.yearsInBusiness = partial.yearsInBusiness ?? 0;
    this.addressStreet = partial.addressStreet ?? '';
    this.addressCity = partial.addressCity ?? '';
    this.addressState = partial.addressState ?? '';
    this.addressZipCode = partial.addressZipCode ?? '';
    this.productsServices = partial.productsServices ?? [];
    this.websiteUrl = partial.websiteUrl ?? '';
    this.contactEmail = partial.contactEmail ?? '';
    this.contactPhone = partial.contactPhone ?? '';
    this.vendorStatus = partial.vendorStatus ?? '';
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
    this.user = partial.user ?? null;
    this.rating = partial.rating;
    this.orders = partial.orders;
    this.onTimeDelivery = partial.onTimeDelivery;
  }
}
