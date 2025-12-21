import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVendorByIdQuery } from '../queries/get-vendor-by-id.query';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VendorMapper } from 'src/modules/vendor/infrastructure/persistence/vendor.mapper';
import { VendorResponseDto } from '../dto/vendor-response.dto';
import { VendorPersistence } from '../../infrastructure/persistence/vendor.persistence';

@QueryHandler(GetVendorByIdQuery)
export class GetVendorByIdHandler implements IQueryHandler<GetVendorByIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetVendorByIdQuery): Promise<VendorResponseDto | null> {
    const { id } = query;

    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return VendorMapper.toResponse(vendor as unknown as VendorPersistence);
  }
}
