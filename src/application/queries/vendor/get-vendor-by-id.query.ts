import { Query } from '@nestjs/cqrs';
import { VendorResponseDto } from '../../dto/vendor/vendor-response.dto';

export class GetVendorByIdQuery extends Query<VendorResponseDto> {
  constructor(public readonly id: string) {
    super();
  }
}
