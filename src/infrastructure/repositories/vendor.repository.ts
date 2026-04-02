import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IVendorRepository } from '../../domain/repositories/vendor-repository.interface';
import { Vendor } from '../../domain/entities/vendor.entity';
import { VendorStatus } from '../../domain/enums/vendor-status.enum';
import { VendorMapper } from '../../application/mappers/vendor.mapper';
import { VendorWherePersistenceInput } from '../types/vendor.types';

@Injectable()
export class VendorRepository implements IVendorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Vendor[]> {
    const vendors = await this.prisma.vendor.findMany({
      where: { isDeleted: false },
      include: { user: true },
    });
    return VendorMapper.fromPrismaResults(vendors);
  }

  async findById(id: string): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, isDeleted: false },
      include: { user: true },
    });
    return vendor ? VendorMapper.fromPrismaResult(vendor) : null;
  }

  async findByUserId(userId: string): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { userId: userId, isDeleted: false },
      include: { user: true },
    });
    return vendor ? VendorMapper.fromPrismaResult(vendor) : null;
  }

  async findAllWithFilters(params: {
    search?: string;
    status?: VendorStatus;
    page: number;
    limit: number;
  }): Promise<{ vendors: Vendor[]; total: number }> {
    const { search, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const existingUserIds = await this.prisma.user.findMany({
      select: { id: true },
    });
    const validUserIds = existingUserIds.map((u: { id: string }) => u.id);

    const where: VendorWherePersistenceInput = {
      userId: { in: validUserIds },
      isDeleted: false,
    };

    if (status) {
      where.vendorStatus = status;
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { registrationNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const prismaWhere = VendorMapper.toPrismaWhereInput(where);

    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where: prismaWhere as unknown as NonNullable<
          Parameters<PrismaService['vendor']['findMany']>[0]
        >['where'],
        skip,
        take: limit,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vendor.count({
        where: prismaWhere as unknown as NonNullable<
          Parameters<PrismaService['vendor']['count']>[0]
        >['where'],
      }),
    ]);

    return {
      vendors: VendorMapper.fromPrismaResults(vendors),
      total,
    };
  }

  async create(data: Partial<Vendor>): Promise<Vendor> {
    const prismaData = VendorMapper.toPrismaCreateInput(data);

    const created = await this.prisma.vendor.create({
      data: prismaData as unknown as Parameters<
        PrismaService['vendor']['create']
      >[0]['data'],
      include: { user: true },
    });

    return VendorMapper.fromPrismaResult(created);
  }

  async update(id: string, data: Partial<Vendor>): Promise<Vendor> {
    const prismaData = VendorMapper.toPrismaUpdateInput(data);

    await this.prisma.vendor.update({
      where: { id },
      data: prismaData as unknown as Parameters<
        PrismaService['vendor']['update']
      >[0]['data'],
    });

    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vendor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.vendor.count({
      where: { id, isDeleted: false },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.vendor.count({
      where: { isDeleted: false },
    });
  }
}
