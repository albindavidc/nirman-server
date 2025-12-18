import { VendorPersistence } from 'src/infrastructure/persistence/vendor.persistence';

/**
 * Interface for Vendor repository operations.
 * Defines the contract for vendor data access that implementations must fulfill.
 */
export interface IVendorRepository {
  /**
   * Creates a new vendor in the database.
   */
  create(data: Partial<VendorPersistence>): Promise<VendorPersistence>;

  /**
   * Finds a vendor by their unique ID.
   */
  findById(id: string): Promise<VendorPersistence | null>;

  /**
   * Retrieves all vendors from the database.
   */
  findAll(): Promise<VendorPersistence[]>;

  /**
   * Updates an existing vendor's data.
   */
  update(data: Partial<VendorPersistence>): Promise<VendorPersistence>;
}

/**
 * Injection token for the Vendor repository.
 */
export const VENDOR_REPOSITORY = Symbol('VENDOR_REPOSITORY');
