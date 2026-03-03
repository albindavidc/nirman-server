import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import { VendorMapper } from '../../../mappers/vendor.mapper';
import { GetVendorByIdQuery } from '../../../queries/vendor/get-vendor-by-id.query';

@QueryHandler(GetVendorByIdQuery)
export class GetVendorByIdHandler implements IQueryHandler<GetVendorByIdQuery> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(query: GetVendorByIdQuery) {
    const { id } = query;

    const vendor = await this.vendorRepository.findById(id);

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return VendorMapper.toResponse(vendor);
  }
}
