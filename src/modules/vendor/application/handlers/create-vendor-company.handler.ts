//src/application/handlers/command/create-vendor-company.handler.ts

import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateVendorCompanyCommand } from 'src/modules/vendor/application/commands/create-vendor-company.command';
import { VendorMapper } from 'src/modules/vendor/infrastructure/persistence/vendor.mapper';
import { IVendorRepository, VENDOR_REPOSITORY } from 'src/modules/vendor/domain/repositories/vendor-repository.interface';

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
    const vendorPersistence = VendorMapper.entityToPersistence(vendorEntity);
    const createdVendor = await this.vendorRepository.create(vendorPersistence);
    const vendorResult = VendorMapper.persistenceToEntity(createdVendor);

    const vendorModel = this.eventPublisher.mergeObjectContext(vendorResult);
    vendorModel.apply('Vendor Created');
    vendorModel.commit();

    return vendorResult.id!;
  }
}
