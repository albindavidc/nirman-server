import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/client/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendorPersistence } from './vendor.persistence';
import { IVendorRepository } from 'src/modules/vendor/domain/repositories/vendor-repository.interface';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';

// Type for creating a vendor - omits auto-generated fields and relation data
type VendorCreateData = {
  user_id: string;
  company_name: string;
  registration_number: string;
  tax_number?: string | null;
  years_in_business?: number | null;
  address_street?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_zip_code?: string | null;
  products_services?: string[];
  website_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  vendor_status?: 'pending' | 'approved' | 'rejected';
};

@Injectable()
export class VendorRepository
  extends BaseRepository<VendorPersistence>
  implements IVendorRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  // Query methods
  async findById(id: string): Promise<VendorPersistence | null> {
    return this.prisma.vendor.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findAll(): Promise<VendorPersistence[]> {
    return this.prisma.vendor.findMany({
      include: { user: true },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.vendor.count({ where: { id } });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.vendor.count();
  }

  // Mutation methods
  async create(data: Partial<VendorPersistence>): Promise<VendorPersistence> {
    // Extract the user_id and remove non-data fields
    const inputData = data as unknown as VendorCreateData;
    const { user_id, ...vendorFields } = inputData;

    const createInput: Prisma.VendorCreateInput = {
      ...vendorFields,
      user: {
        connect: { id: user_id },
      },
    };

    const created = await this.prisma.vendor.create({
      data: createInput,
      include: {
        user: true,
      },
    });

    return created;
  }

  async update(
    id: string,
    data: Partial<VendorPersistence>,
  ): Promise<VendorPersistence> {
    // Create a shallow copy and remove fields that shouldn't be updated
    const inputData = { ...data } as Record<string, unknown>;
    delete inputData.id;
    delete inputData.user;
    delete inputData.user_id;

    const updateInput: Prisma.VendorUpdateInput =
      inputData as Prisma.VendorUpdateInput;

    return this.prisma.vendor.update({
      where: { id },
      data: updateInput,
      include: { user: true },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vendor.delete({ where: { id } });
  }
}
