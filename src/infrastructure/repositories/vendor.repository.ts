import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendorPersistence } from '../persistence/vendor.persistence';

@Injectable()
export class VendorRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<VendorPersistence>): Promise<VendorPersistence> {
    return this.prisma.vendor.create({
      data: data as any,
      include: {
        user: true,
      },
    });
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
