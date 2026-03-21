import { Command } from '@nestjs/cqrs';
import { VendorResponseDto } from '../../dto/vendor/vendor-response.dto';

export class BlacklistVendorCommand extends Command<VendorResponseDto> {
  constructor(public readonly id: string) {
    super();
  }
}
