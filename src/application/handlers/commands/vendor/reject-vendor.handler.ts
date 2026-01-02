import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RejectVendorCommand } from '../../../commands/vendor/reject-vendor.command';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { VendorResponseDto } from '../../../dto/vendor/vendor-response.dto';
import { VendorMapper } from '../../../../infrastructure/persistence/repositories/vendor/vendor.mapper';

@CommandHandler(RejectVendorCommand)
export class RejectVendorHandler implements ICommandHandler<RejectVendorCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: RejectVendorCommand): Promise<VendorResponseDto> {
    const { id, reason } = command;

    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const updatedVendor = await this.prisma.vendor.update({
      where: { id },
      data: {
        vendor_status: 'rejected',
        rejection_reason: reason,
      },
      include: {
        user: true,
      },
    });

    return VendorMapper.toResponse(updatedVendor);
  }
}
