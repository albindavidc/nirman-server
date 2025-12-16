import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { GetVendorsQueryDto } from 'src/application/dto/get-vendors.dto';
import { UpdateVendorDto } from 'src/application/dto/update-vendor.dto';
import { GetVendorsQuery } from 'src/application/query/get-vendors.query';
import { UpdateVendorCommand } from 'src/application/command/update-vendor.command';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateVendorByAdminCommand } from 'src/application/command/create-vendor-by-admin.command';
import { CreateVendorByAdminDto } from 'src/application/dto/create-vendor-by-admin.dto';

@Controller('vendors')
@UseGuards(JwtAuthGuard)
export class VendorManagementController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createVendor(@Body() createDto: CreateVendorByAdminDto) {
    return this.commandBus.execute(new CreateVendorByAdminCommand(createDto));
  }

  @Get()
  async getVendors(@Query() queryDto: GetVendorsQueryDto) {
    return this.queryBus.execute(
      new GetVendorsQuery(
        queryDto.status,
        queryDto.search,
        queryDto.page,
        queryDto.limit,
      ),
    );
  }

  @Get('stats')
  async getStats() {
    const [total, approved] = await Promise.all([
      this.prisma.vendor.count(),
      this.prisma.vendor.count({ where: { vendor_status: 'approved' } }),
    ]);

    return {
      total,
      active: approved,
      avgRating: 4.3, // Mock for now
      onTimeDelivery: 96, // Mock for now
    };
  }

  @Get(':id')
  async getVendorById(@Param('id') id: string) {
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
      return null;
    }

    return this.mapToDto(vendor);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateVendor(
    @Param('id') id: string,
    @Body() updateDto: UpdateVendorDto,
  ) {
    return this.commandBus.execute(new UpdateVendorCommand(id, updateDto));
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
    };
  }
}
