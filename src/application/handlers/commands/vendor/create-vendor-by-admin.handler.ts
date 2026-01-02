import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import { CreateVendorByAdminCommand } from '../../../commands/vendor/create-vendor-by-admin.command';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from '../../../../domain/repositories/vendor-repository.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { UserMapper } from '../../../mappers/user/user.mapper';
import { VendorMapper } from '../../../mappers/vendor/vendor.mapper';
import * as argon2 from 'argon2';
import { Role } from '../../../../domain/enums/role.enum';
import { VendorStatus } from '../../../../domain/enums/vendor-status.enum';

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
    userEntity.role = Role.VENDOR;

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
