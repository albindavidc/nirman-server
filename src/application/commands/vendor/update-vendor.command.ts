export class UpdateVendorCommand {
  constructor(
    public readonly vendorId: string,
    public readonly data: {
      companyName?: string;
      registrationNumber?: string;
      taxNumber?: string;
      addressStreet?: string;
      addressCity?: string;
      addressState?: string;
      addressZipCode?: string;
      contactPhone?: string;
      contactEmail?: string;
      websiteUrl?: string;
      vendorStatus?: string;
    },
  ) {}
}
