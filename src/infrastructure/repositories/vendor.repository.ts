import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IVendorRepository } from '../../domain/repositories/vendor-repository.interface';
import { BaseRepository } from './base.repository';
import { Vendor } from '../../domain/entities/vendor.entity';
import { VendorStatus } from '../../domain/enums/vendor-status.enum';
import { VendorMapper } from '../mappers/vendor.mapper';
import { VendorWherePersistenceInput } from '../types/vendor.types';

@Injectable()
export class VendorRepository
  extends BaseRepository<Vendor>
  implements IVendorRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findAll(): Promise<Vendor[]> {
    const vendors = await this.prisma.vendor.findMany({
      where: { is_deleted: false },
      include: { user: true },
    });
    return VendorMapper.fromPrismaResults(vendors);
  }

  async findById(id: string): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, is_deleted: false },
      include: { user: true },
    });
    return vendor ? VendorMapper.fromPrismaResult(vendor) : null;
  }

  async findByUserId(userId: string): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { user_id: userId, is_deleted: false },
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
    const validUserIds = existingUserIds.map((u) => u.id);

    const where: VendorWherePersistenceInput = {
      user_id: { in: validUserIds },
      is_deleted: false,
    };

    if (status) {
      where.vendor_status = status;
    }

    if (search) {
      where.OR = [
        { company_name: { contains: search, mode: 'insensitive' } },
        { registration_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    const prismaWhere = VendorMapper.toPrismaWhereInput(where);

    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where: prismaWhere,
        skip,
        take: limit,
        include: { user: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.vendor.count({ where: prismaWhere }),
    ]);

    return {
      vendors: VendorMapper.fromPrismaResults(vendors),
      total,
    };
  }

  async create(data: Partial<Vendor>): Promise<Vendor> {
    const prismaData = VendorMapper.toPrismaCreateInput(data);

    const created = await this.prisma.vendor.create({
      data: prismaData,
      include: { user: true },
    });

    return VendorMapper.fromPrismaResult(created);
  }

  async update(id: string, data: Partial<Vendor>): Promise<Vendor> {
    const prismaData = VendorMapper.toPrismaUpdateInput(data);

    await this.prisma.vendor.update({
      where: { id },
      data: prismaData,
    });

    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vendor.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.vendor.count({
      where: { id, is_deleted: false },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.vendor.count({
      where: { is_deleted: false },
    });
  }
}
