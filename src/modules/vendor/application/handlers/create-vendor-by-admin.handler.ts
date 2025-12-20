import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateVendorByAdminCommand } from '../commands/create-vendor-by-admin.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/repositories/user-repository.interface';
import {
  IVendorRepository,
  VENDOR_REPOSITORY,
} from 'src/modules/vendor/domain/repositories/vendor-repository.interface';
import { Vendor } from 'src/modules/vendor/domain/entities/vendor.entity';
import { VendorStatus } from 'src/modules/vendor/domain/enums/vendor-status.enum';
import { UserPersistence } from 'src/modules/user/infrastructure/persistence/user.persistence';

import { VendorPersistence } from 'src/modules/vendor/infrastructure/persistence/vendor.persistence';

interface CreateVendorByAdminResult {
  user: UserPersistence;
  vendor: VendorPersistence;
}

@CommandHandler(CreateVendorByAdminCommand)
export class CreateVendorByAdminHandler implements ICommandHandler<CreateVendorByAdminCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: CreateVendorByAdminCommand,
  ): Promise<CreateVendorByAdminResult> {
    const { dto } = command;

    // 1. Check if user exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // 2. Create User
    // Generate a default password or random one. For now, using a default.
    const defaultPassword = 'Vendor@123';
    const passwordHash = await argon2.hash(defaultPassword);

    // Create and persist the user
    // The repository method create takes Partial<UserPersistence>.

    const createdUser = await this.userRepository.create({
      email: dto.email,
      password_hash: passwordHash,
      first_name: dto.firstName,
      last_name: dto.lastName,
      role: 'vendor',
      is_email_verified: true, // Auto-verify if admin creates
      phone_number: dto.phone,
    });

    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    // 3. Create Vendor Profile
    const vendor = new Vendor({
      userId: createdUser.id,
      companyName: dto.companyName,
      registrationNumber: dto.registrationNumber,
      taxNumber: dto.taxNumber,
      yearsInBusiness: dto.yearsInBusiness,
      addressStreet: dto.addressStreet,
      addressCity: dto.addressCity,
      addressState: dto.addressState,
      addressZipCode: dto.addressZipCode,
      productsService: dto.productsServices || [],
      websiteUrl: dto.websiteUrl,
      contactEmail: dto.contactEmail || dto.email,
      contactPhone: dto.contactPhone || dto.phone,
      vendorStatus: (dto.vendorStatus as VendorStatus) || VendorStatus.APPROVED,
    });

    const createdVendor = await this.vendorRepository.create(vendor);

    // In a real event-sourced system we would merge object context and commit,
    // but here we are using direct repo calls mostly.
    // If we want events:
    // const userModel = this.eventPublisher.mergeObjectContext(user);
    // userModel.commit();

    return {
      user: createdUser,
      vendor: createdVendor,
    };
  }
}
