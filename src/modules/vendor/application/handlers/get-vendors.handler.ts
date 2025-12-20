import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVendorsQuery } from '../queries/get-vendors.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendorMapper } from '../../infrastructure/persistence/vendor.mapper';
import { VendorPersistence } from '../../infrastructure/persistence/vendor.persistence';
import type { VendorWhereInput } from 'src/generated/client/models/Vendor';
import { VendorStatus } from 'src/generated/client/enums';

@QueryHandler(GetVendorsQuery)
export class GetVendorsHandler implements IQueryHandler<GetVendorsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetVendorsQuery) {
    const { status, search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: VendorWhereInput = {};

    if (status) {
      where.vendor_status = status as VendorStatus;
    }

    if (search) {
      where.OR = [
        { company_name: { contains: search, mode: 'insensitive' as const } },
        {
          registration_number: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
      ];
    }

    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.vendor.count({ where }),
    ]);

    return {
      vendors: vendors.map((v) => {
        const dto = VendorMapper.toResponse(v as unknown as VendorPersistence);
        return {
          ...dto,
          rating: 4.5,
          orders: Math.floor(Math.random() * 50) + 10,
          onTimeDelivery: Math.floor(Math.random() * 10) + 90,
        };
      }),
      total,
      page,
      limit,
    };
  }
}
