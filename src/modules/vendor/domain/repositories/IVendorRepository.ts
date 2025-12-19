import { VendorPersistence } from 'src/modules/vendor/infrastructure/persistence/vendor.persistence';

export interface IVendorRepository {
  // Query methods
  findById(id: string): Promise<VendorPersistence | null>;
  findAll(): Promise<VendorPersistence[]>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;

  // Mutation methods
  create(data: Partial<VendorPersistence>): Promise<VendorPersistence>;
  update(
    id: string,
    data: Partial<VendorPersistence>,
  ): Promise<VendorPersistence>;
  delete(id: string): Promise<void>;
}

/**
 * Injection token for the Vendor repository.
 */
export const VENDOR_REPOSITORY = Symbol('VENDOR_REPOSITORY');
