import { VendorStatus } from '../enums/vendor-status.enum';
import { Vendor } from '../entities/vendor.entity';

export interface IVendorRepository {
  // Query methods
  findById(id: string): Promise<Vendor | null>;
  findAll(): Promise<Vendor[]>;
  findAllWithFilters(params: {
    search?: string;
    status?: VendorStatus;
    page: number;
    limit: number;
  }): Promise<{ vendors: Vendor[]; total: number }>;
  findByUserId(userId: string): Promise<Vendor | null>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;

  // Mutation methods
  create(data: Partial<Vendor>): Promise<Vendor>;
  update(id: string, data: Partial<Vendor>): Promise<Vendor>;
  delete(id: string): Promise<void>;
}

/**
 * Injection token for the Vendor repository.
 */
export const VENDOR_REPOSITORY = Symbol('VENDOR_REPOSITORY');
