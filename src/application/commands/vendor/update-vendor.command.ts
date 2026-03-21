import { Command } from '@nestjs/cqrs';
import { VendorResponseDto } from '../../dto/vendor/vendor-response.dto';

export class UpdateVendorCommand extends Command<VendorResponseDto> {
  constructor(
    public readonly vendorId: string,
    public readonly data: {
      companyName?: string;
      registrationNumber?: string;
      taxNumber?: string;
      yearsInBusiness?: number;
      addressStreet?: string;
      addressCity?: string;
      addressState?: string;
      addressZipCode?: string;
      contactPhone?: string;
      contactEmail?: string;
      websiteUrl?: string;
      productsServices?: string[];
      vendorStatus?: string;
    },
  ) {
    super();
  }
}
