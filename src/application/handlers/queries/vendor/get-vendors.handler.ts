import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import { VendorMapper } from '../../../mappers/vendor.mapper';
import { GetVendorsQuery } from '../../../queries/vendor/get-vendors.query';

@QueryHandler(GetVendorsQuery)
export class GetVendorsHandler implements IQueryHandler<GetVendorsQuery> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(query: GetVendorsQuery) {
    const { status, search, page, limit } = query;

    const { vendors, total } = await this.vendorRepository.findAllWithFilters({
      search,
      status,
      page,
      limit,
    });

    return {
      data: vendors.map((v) => {
        const dto = VendorMapper.toResponse(v);
        return {
          ...dto,
          rating: 4.5, // Dummy data for now as per previous logic
          orders: Math.floor(Math.random() * 50) + 10,
          onTimeDelivery: Math.floor(Math.random() * 10) + 90,
        };
      }),
      total,
      page,
      limit,
    };
  }
}
