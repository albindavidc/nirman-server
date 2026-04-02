import { VendorStatus } from '../../domain/enums/vendor-status.enum';

export interface VendorUserPersistence {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface VendorBase {
  id: string;
  userId: string;
  companyName: string;
  registrationNumber: string;
  taxNumber: string | null;
  yearsInBusiness: number | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZipCode: string | null;
  productsServices: string[];
  websiteUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  vendorStatus: VendorStatus;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface VendorPersistence extends VendorBase {
  user?: VendorUserPersistence | null;
}

export interface VendorWherePersistenceInput {
  userId?: string | { in: string[] };
  isDeleted?: boolean;
  vendorStatus?: VendorStatus;
  OR?: Array<{
    companyName?: { contains: string; mode: 'insensitive' };
    registrationNumber?: { contains: string; mode: 'insensitive' };
  }>;
}

export interface VendorCreatePersistenceInput extends Omit<
  VendorBase,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
> {
  userId: string;
  companyName: string;
  registrationNumber: string;
  vendorStatus: VendorStatus;
}

export type VendorUpdatePersistenceInput = Partial<
  Omit<VendorBase, 'id' | 'createdAt' | 'updatedAt'>
>;
