import { AggregateRoot } from '@nestjs/cqrs';
import { VendorStatus } from '../enums/vendor-status.enum';
import { VendorUser } from '../types/vendor.types';

export class Vendor extends AggregateRoot {
  private readonly _id: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private readonly _userId: string;
  private _user?: VendorUser;
  private _companyName: string;
  private _registrationNumber: string;
  private _taxNumber?: string;
  private _yearsInBusiness?: number;
  private _addressStreet?: string;
  private _addressCity?: string;
  private _addressState?: string;
  private _addressZipCode?: string;
  private _productsService: string[];
  private _websiteUrl?: string;
  private _contactEmail?: string;
  private _contactPhone?: string;
  private _vendorStatus: VendorStatus;
  private _rejectionReason?: string | null;

  constructor(
    props: Partial<Vendor> & {
      userId: string;
      companyName: string;
      registrationNumber: string;
      vendorStatus?: VendorStatus;
    },
  ) {
    super();
    // Use proper destructuring or typing rather than `any`
    // We expect props to either be raw POJO data from Prisma or partial DTOs
    const {
      id,
      createdAt,
      updatedAt,
      userId,
      companyName,
      registrationNumber,
      taxNumber,
      yearsInBusiness,
      addressStreet,
      addressCity,
      addressState,
      addressZipCode,
      productsService,
      websiteUrl,
      contactEmail,
      contactPhone,
      vendorStatus,
      rejectionReason,
      user,
    } = props as unknown as {
      [key: string]:
        | string
        | number
        | Date
        | VendorStatus
        | VendorUser
        | string[]
        | undefined
        | null;
    };

    this._id = (id as string) ?? '';
    this._createdAt = (createdAt as Date) ?? new Date();
    this._updatedAt = (updatedAt as Date) ?? new Date();
    this._userId = userId as string;
    this._companyName = companyName as string;
    this._registrationNumber = registrationNumber as string;
    this._taxNumber = taxNumber as string | undefined;
    this._yearsInBusiness = yearsInBusiness as number | undefined;
    this._addressStreet = addressStreet as string | undefined;
    this._addressCity = addressCity as string | undefined;
    this._addressState = addressState as string | undefined;
    this._addressZipCode = addressZipCode as string | undefined;
    this._productsService = (productsService as string[]) ?? [];
    this._websiteUrl = websiteUrl as string | undefined;
    this._contactEmail = contactEmail as string | undefined;
    this._contactPhone = contactPhone as string | undefined;
    this._vendorStatus = (vendorStatus as VendorStatus) ?? VendorStatus.PENDING;
    this._rejectionReason = rejectionReason as string | null | undefined;
    this._user = user as VendorUser | undefined;
  }

  get id(): string {
    return this._id;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  get userId(): string {
    return this._userId;
  }
  get user(): VendorUser | undefined {
    return this._user;
  }
  get companyName(): string {
    return this._companyName;
  }
  get registrationNumber(): string {
    return this._registrationNumber;
  }
  get taxNumber(): string | undefined {
    return this._taxNumber;
  }
  get yearsInBusiness(): number | undefined {
    return this._yearsInBusiness;
  }
  get addressStreet(): string | undefined {
    return this._addressStreet;
  }
  get addressCity(): string | undefined {
    return this._addressCity;
  }
  get addressState(): string | undefined {
    return this._addressState;
  }
  get addressZipCode(): string | undefined {
    return this._addressZipCode;
  }
  get productsService(): string[] {
    return this._productsService;
  }
  get websiteUrl(): string | undefined {
    return this._websiteUrl;
  }
  get contactEmail(): string | undefined {
    return this._contactEmail;
  }
  get contactPhone(): string | undefined {
    return this._contactPhone;
  }
  get vendorStatus(): VendorStatus {
    return this._vendorStatus;
  }
  get rejectionReason(): string | null | undefined {
    return this._rejectionReason;
  }

  updateStatus(status: VendorStatus, rejectionReason?: string | null): void {
    this._vendorStatus = status;
    if (rejectionReason !== undefined) {
      this._rejectionReason = rejectionReason;
    }
    this._updatedAt = new Date();
  }

  updateCompanyDetails(
    companyName: string,
    registrationNumber: string,
    taxNumber?: string,
    yearsInBusiness?: number,
    websiteUrl?: string,
  ): void {
    this._companyName = companyName;
    this._registrationNumber = registrationNumber;
    this._taxNumber = taxNumber;
    this._yearsInBusiness = yearsInBusiness;
    this._websiteUrl = websiteUrl;
    this._updatedAt = new Date();
  }

  updateAddress(
    street?: string,
    city?: string,
    state?: string,
    zipCode?: string,
  ): void {
    this._addressStreet = street;
    this._addressCity = city;
    this._addressState = state;
    this._addressZipCode = zipCode;
    this._updatedAt = new Date();
  }

  updateContactInfo(email?: string, phone?: string): void {
    this._contactEmail = email;
    this._contactPhone = phone;
    this._updatedAt = new Date();
  }

  setProductsOrServices(productsService: string[]): void {
    this._productsService = productsService;
    this._updatedAt = new Date();
  }
}
