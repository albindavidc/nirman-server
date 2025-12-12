import { BaseEntity } from '../base.entity';
import { VendorStatus } from '../enums/vendor-status.enum';

export class Vendor extends BaseEntity {
  userId: string;
  companyName: string;
  registrationNumber: string;
  taxNumber?: string;
  yearsInBusiness?: number;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  productsService: string[];
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  vendorStatus: VendorStatus;

  constructor(props: Partial<Vendor>) {
    super();
    this.userId = props.userId!;
    this.companyName = props.companyName!;
    this.registrationNumber = props.registrationNumber!;
    this.taxNumber = props.taxNumber;
    this.yearsInBusiness = props.yearsInBusiness;
    this.addressStreet = props.addressStreet;
    this.addressCity = props.addressCity;
    this.addressState = props.addressState;
    this.addressZipCode = props.addressZipCode;
    this.productsService = props.productsService ?? [];
    this.website = props.website;
    this.contactEmail = props.contactEmail;
    this.contactPhone = props.contactPhone;
    this.vendorStatus = props.vendorStatus!;
  }
}
