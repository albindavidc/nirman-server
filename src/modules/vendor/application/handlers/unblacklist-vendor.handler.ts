import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnblacklistVendorCommand } from '../commands/unblacklist-vendor.command';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { VendorResponseDto } from '../dto/vendor-response.dto';
import { VendorMapper } from '../../infrastructure/persistence/vendor.mapper';

@CommandHandler(UnblacklistVendorCommand)
export class UnblacklistVendorHandler implements ICommandHandler<UnblacklistVendorCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UnblacklistVendorCommand): Promise<VendorResponseDto> {
    const { id } = command;

    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const updatedVendor = await this.prisma.vendor.update({
      where: { id },
      data: {
        vendor_status: 'approved',
      },
      include: {
        user: true,
      },
    });

    return VendorMapper.toResponse(updatedVendor as any);
  }
}
