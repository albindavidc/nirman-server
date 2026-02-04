import { VendorStatus } from '../../domain/enums/vendor-status.enum';

export interface VendorUserPersistence {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface VendorBase {
  id: string;
  user_id: string;
  company_name: string;
  registration_number: string;
  tax_number: string | null;
  years_in_business: number | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip_code: string | null;
  products_services: string[];
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  vendor_status: VendorStatus;
  rejection_reason: string | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  deleted_at: Date | null;
}

export interface VendorPersistence extends VendorBase {
  user?: VendorUserPersistence | null;
}

export interface VendorWherePersistenceInput {
  user_id?: string | { in: string[] };
  is_deleted?: boolean;
  vendor_status?: VendorStatus;
  OR?: Array<{
    company_name?: { contains: string; mode: 'insensitive' };
    registration_number?: { contains: string; mode: 'insensitive' };
  }>;
}

export interface VendorCreatePersistenceInput extends Omit<
  VendorBase,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> {
  user_id: string;
  company_name: string;
  registration_number: string;
  vendor_status: VendorStatus;
}

export type VendorUpdatePersistenceInput = Partial<
  Omit<VendorBase, 'id' | 'created_at' | 'updated_at'>
>;
