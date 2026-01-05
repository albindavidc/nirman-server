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
import { JwtAuthGuard } from '../../common/security/guards/jwt-auth.guard';
import { GetVendorsQueryDto } from '../../application/dto/vendor/get-vendors.dto';
import { UpdateVendorDto } from '../../application/dto/vendor/update-vendor.dto';
import { GetVendorsQuery } from '../../application/queries/vendor/get-vendors.query';
import { UpdateVendorCommand } from '../../application/commands/vendor/update-vendor.command';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

import { CreateVendorByAdminCommand } from '../../application/commands/vendor/create-vendor-by-admin.command';
import { UnblacklistVendorCommand } from '../../application/commands/vendor/unblacklist-vendor.command';
import { RejectVendorCommand } from '../../application/commands/vendor/reject-vendor.command';
import { RequestRecheckCommand } from '../../application/commands/vendor/request-recheck.command';
import { CreateVendorByAdminDto } from '../../application/dto/vendor/create-vendor-by-admin.dto';
import { GetVendorByIdQuery } from '../../application/queries/vendor/get-vendor-by-id.query';
import { VendorResponseDto } from '../../application/dto/vendor/vendor-response.dto';

import { VENDOR_ROUTES } from '../../app.routes';

@Controller(VENDOR_ROUTES.ROOT)
@UseGuards(JwtAuthGuard)
export class VendorManagementController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly prisma: PrismaService,
  ) {}

  @Post(VENDOR_ROUTES.CREATE_VENDOR)
  @HttpCode(HttpStatus.CREATED)
  async createVendor(
    @Body() createDto: CreateVendorByAdminDto,
  ): Promise<VendorResponseDto> {
    return this.commandBus.execute(new CreateVendorByAdminCommand(createDto));
  }

  @Get(VENDOR_ROUTES.GET_VENDORS)
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

  @Get(VENDOR_ROUTES.GET_STATS)
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

  @Get(VENDOR_ROUTES.GET_VENDOR_BY_ID)
  async getVendorById(
    @Param('id') id: string,
  ): Promise<VendorResponseDto | null> {
    return this.queryBus.execute(new GetVendorByIdQuery(id));
  }

  @Patch(VENDOR_ROUTES.UPDATE_VENDOR)
  @HttpCode(HttpStatus.OK)
  async updateVendor(
    @Param('id') id: string,
    @Body() updateDto: UpdateVendorDto,
  ): Promise<VendorResponseDto> {
    return this.commandBus.execute(new UpdateVendorCommand(id, updateDto));
  }

  @Patch(':id/unblacklist')
  @HttpCode(HttpStatus.OK)
  async unblacklistVendor(@Param('id') id: string): Promise<VendorResponseDto> {
    return this.commandBus.execute(new UnblacklistVendorCommand(id));
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectVendor(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<VendorResponseDto> {
    return this.commandBus.execute(new RejectVendorCommand(id, reason));
  }

  @Patch(':id/request-recheck')
  @HttpCode(HttpStatus.OK)
  async requestRecheck(@Param('id') id: string): Promise<VendorResponseDto> {
    return this.commandBus.execute(new RequestRecheckCommand(id));
  }
}
