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
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/jwt-auth.guard';
import { GetVendorsQueryDto } from 'src/modules/vendor/application/dto/get-vendors.dto';
import { UpdateVendorDto } from 'src/modules/vendor/application/dto/update-vendor.dto';
import { GetVendorsQuery } from 'src/modules/vendor/application/queries/get-vendors.query';
import { UpdateVendorCommand } from 'src/modules/vendor/application/commands/update-vendor.command';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateVendorByAdminCommand } from 'src/modules/vendor/application/commands/create-vendor-by-admin.command';
import { CreateVendorByAdminDto } from 'src/modules/vendor/application/dto/create-vendor-by-admin.dto';
import { GetVendorByIdQuery } from '../application/queries/get-vendor-by-id.query';
import { VendorResponseDto } from '../application/dto/vendor-response.dto';

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
  async createVendor(
    @Body() createDto: CreateVendorByAdminDto,
  ): Promise<VendorResponseDto> {
    return this.commandBus.execute(new CreateVendorByAdminCommand(createDto));
  }

  @Get()
  async getVendors(@Query() queryDto: GetVendorsQueryDto): Promise<{
    data: VendorResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
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
  async getVendorById(
    @Param('id') id: string,
  ): Promise<VendorResponseDto | null> {
    return this.queryBus.execute(new GetVendorByIdQuery(id));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateVendor(
    @Param('id') id: string,
    @Body() updateDto: UpdateVendorDto,
  ): Promise<VendorResponseDto> {
    return this.commandBus.execute(new UpdateVendorCommand(id, updateDto));
  }
}
