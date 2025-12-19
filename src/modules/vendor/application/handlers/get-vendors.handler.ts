import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVendorsQuery } from '../queries/get-vendors.query';
import { PrismaService } from 'src/prisma/prisma.service';

@QueryHandler(GetVendorsQuery)
export class GetVendorsHandler implements IQueryHandler<GetVendorsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetVendorsQuery) {
    const { status, search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.vendor_status = status;
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
      vendors: vendors.map((v) => this.mapToDto(v)),
      total,
      page,
      limit,
    };
  }

  private mapToDto(vendor: any) {
    return {
      id: vendor.id,
      userId: vendor.user_id,
      companyName: vendor.company_name,
      registrationNumber: vendor.registration_number,
      taxNumber: vendor.tax_number,
      yearsInBusiness: vendor.years_in_business,
      addressStreet: vendor.address_street,
      addressCity: vendor.address_city,
      addressState: vendor.address_state,
      addressZipCode: vendor.address_zip_code,
      productsServices: vendor.products_services,
      websiteUrl: vendor.website_url,
      contactEmail: vendor.contact_email,
      contactPhone: vendor.contact_phone,
      vendorStatus: vendor.vendor_status,
      createdAt: vendor.created_at,
      updatedAt: vendor.updated_at,
      user: vendor.user
        ? {
            firstName: vendor.user.first_name,
            lastName: vendor.user.last_name,
            email: vendor.user.email,
          }
        : null,
      // Mock data for now (will be calculated from orders later)
      rating: 4.5,
      orders: Math.floor(Math.random() * 50) + 10,
      onTimeDelivery: Math.floor(Math.random() * 10) + 90,
    };
  }
}
