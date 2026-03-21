import { Command } from '@nestjs/cqrs';
import { VendorResponseDto } from '../../dto/vendor/vendor-response.dto';

export class RejectVendorCommand extends Command<VendorResponseDto> {
  constructor(
    public readonly id: string,
    public readonly reason: string,
  ) {
    super();
  }
}
