import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateVendorCompanyCommand } from '../../../commands/vendor/create-vendor-company.command';
import { VendorMapper } from '../../../mappers/vendor/vendor.mapper';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';

@CommandHandler(CreateVendorCompanyCommand)
export class CreateVendorCompanyHandler implements ICommandHandler<CreateVendorCompanyCommand> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateVendorCompanyCommand): Promise<string> {
    const { dto, userId } = command;

    const existingVendor = await this.vendorRepository.findById(userId);
    if (existingVendor) {
      throw new BadRequestException('Vendor already exists');
    }

    const vendorEntity = VendorMapper.dtoToEntity({ ...dto, userId });

    // Repository now accepts the Domain Entity directly
    const createdVendor = await this.vendorRepository.create(vendorEntity);

    const vendorModel = this.eventPublisher.mergeObjectContext(createdVendor);
    vendorModel.apply('Vendor Created');
    vendorModel.commit();

    return createdVendor.id;
  }
}
