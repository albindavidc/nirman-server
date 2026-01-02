import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IVendorRepository } from '../../../../domain/repositories/vendor-repository.interface';
import { BaseRepository } from '../../base.repository';
import { Vendor } from '../../../../domain/entities/vendor.entity';
import { VendorMapper } from './vendor.mapper';
import { Prisma, VendorStatus } from '../../../../generated/client/client';

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
      include: { user: true },
    });
    return vendors.map((v) => VendorMapper.persistenceToEntity(v));
  }

  async findById(id: string): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        user: true, // Include user to map relations if needed by Mapper
      },
    });
    return vendor ? VendorMapper.persistenceToEntity(vendor) : null;
  }

  async findByUserId(userId: string): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { user_id: userId },
      include: { user: true },
    });
    return vendor ? VendorMapper.persistenceToEntity(vendor) : null;
  }

  async findAllWithFilters(params: {
    search?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<{ vendors: Vendor[]; total: number }> {
    const { search, status, page, limit } = params;
    const skip = (page - 1) * limit;

    // First, get all user IDs that exist to filter out orphaned vendors
    const existingUserIds = await this.prisma.user.findMany({
      select: { id: true },
    });
    const validUserIds = existingUserIds.map((u) => u.id);

    const where: Prisma.VendorWhereInput = {
      // Only include vendors whose user_id exists in the users collection
      user_id: { in: validUserIds },
    };

    if (status) {
      where.vendor_status = status as VendorStatus;
    }

    if (search) {
      where.OR = [
        { company_name: { contains: search, mode: 'insensitive' } },
        { registration_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        include: { user: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.vendor.count({ where }),
    ]);

    return {
      vendors: vendors.map((v) => VendorMapper.persistenceToEntity(v)),
      total,
    };
  }

  async create(data: Partial<Vendor>): Promise<Vendor> {
    const persistenceData = VendorMapper.entityToPersistence(data);
    const { user: _user, ...createData } = persistenceData as {
      user?: unknown;
    };
    void _user; // Intentionally unused - user relation should not be included in create data

    const created = await this.prisma.vendor.create({
      data: createData as Prisma.VendorCreateInput,
      include: { user: true },
    });

    return VendorMapper.persistenceToEntity(created);
  }

  async update(id: string, data: Partial<Vendor>): Promise<Vendor> {
    const persistenceData = VendorMapper.entityToPersistence(data);
    const {
      user: _user,
      id: _id,
      ...updateData
    } = persistenceData as {
      user?: unknown;
      id?: string;
    };
    void _user; // Intentionally unused - user relation should not be included in update data
    void _id; // Intentionally unused - id is used in where clause, not in update data

    // Clean undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    await this.prisma.vendor.update({
      where: { id },
      data: updateData as Prisma.VendorUpdateInput,
    });

    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vendor.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.vendor.count({ where: { id } });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.vendor.count();
  }
}
