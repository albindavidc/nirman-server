import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendorPersistence } from './vendor.persistence';
import { IVendorRepository } from 'src/modules/vendor/domain/repositories/vendor-repository.interface';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';

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
    const { id, user, user_id, ...createData } = data as any;

    const created = await this.prisma.vendor.create({
      data: {
        ...createData,
        user: {
          connect: { id: user_id },
        },
      },
      include: {
        user: true,
      },
    });

    return created as VendorPersistence;
  }

  async update(
    id: string,
    data: Partial<VendorPersistence>,
  ): Promise<VendorPersistence> {
    const { user, user_id, ...updateData } = data as any;
    delete updateData.id;

    return this.prisma.vendor.update({
      where: { id },
      data: updateData,
      include: { user: true },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vendor.delete({ where: { id } });
  }
}
