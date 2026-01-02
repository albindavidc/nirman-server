import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestRecheckCommand } from '../../../commands/vendor/request-recheck.command';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { VendorResponseDto } from '../../../dto/vendor/vendor-response.dto';
import { VendorMapper } from '../../../../infrastructure/persistence/repositories/vendor/vendor.mapper';

@CommandHandler(RequestRecheckCommand)
export class RequestRecheckHandler implements ICommandHandler<RequestRecheckCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: RequestRecheckCommand): Promise<VendorResponseDto> {
    const { id } = command;

    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const updatedVendor = await this.prisma.vendor.update({
      where: { id },
      data: {
        vendor_status: 'pending',
        rejection_reason: null,
      },
      include: {
        user: true,
      },
    });

    return VendorMapper.toResponse(updatedVendor);
  }
}
