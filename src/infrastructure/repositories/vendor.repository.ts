import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendorPersistence } from '../persistence/vendor.persistence';

@Injectable()
export class VendorRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<VendorPersistence>): Promise<VendorPersistence> {
    // Extract user_id and remove fields that shouldn't be in create data
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

  async update(data: Partial<VendorPersistence>): Promise<VendorPersistence> {
    return this.prisma.vendor.update({
      where: { id: data.id },
      data: data as any,
      include: { user: true },
    });
  }
}
