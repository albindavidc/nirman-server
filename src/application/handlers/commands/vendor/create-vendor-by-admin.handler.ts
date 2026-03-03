import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import * as argon2 from 'argon2';
import { VendorStatus } from '../../../../domain/enums/vendor-status.enum';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import { CreateVendorByAdminCommand } from '../../../commands/vendor/create-vendor-by-admin.command';
import { UserMapper } from '../../../mappers/user.mapper';
import { VendorMapper } from '../../../mappers/vendor.mapper';

@CommandHandler(CreateVendorByAdminCommand)
export class CreateVendorByAdminHandler implements ICommandHandler<CreateVendorByAdminCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateVendorByAdminCommand) {
    const { dto } = command;

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);

    const userEntity = UserMapper.dtoToEntity({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phone,
      password: hashedPassword,
    });
    const createdUser = await this.userRepository.create(userEntity);

    const vendorEntity = VendorMapper.dtoToEntity({
      userId: createdUser.id,
      companyName: dto.companyName,
      registrationNumber: dto.registrationNumber,
      taxNumber: dto.taxNumber ?? '',
      yearsInBusiness: dto.yearsInBusiness ?? 0,
      addressStreet: dto.addressStreet ?? '',
      addressCity: dto.addressCity ?? '',
      addressState: dto.addressState ?? '',
      addressZipCode: dto.addressZipCode ?? '',
      productsServices: dto.productsServices ?? [],
      websiteUrl: dto.websiteUrl ?? '',
      contactEmail: dto.contactEmail ?? '',
      contactPhone: dto.contactPhone ?? '',
      vendorStatus: VendorStatus.APPROVED,
    });

    const createdVendor = await this.vendorRepository.create(vendorEntity);

    return {
      user: createdUser,
      vendor: createdVendor,
    };
  }
}
