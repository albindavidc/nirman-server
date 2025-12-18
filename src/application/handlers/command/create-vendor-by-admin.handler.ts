import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateVendorByAdminCommand } from '../../command/create-vendor-by-admin.command';
import {
  IUserRepository,
  USER_REPOSITORY,
  IVendorRepository,
  VENDOR_REPOSITORY,
} from 'src/domain/repositories';
import { User } from 'src/domain/entities/user.entity';
import { Vendor } from 'src/domain/entities/vendor.entity';
import { Role } from 'src/domain/enums/role.enum';
import { VendorStatus } from 'src/domain/enums/vendor-status.enum';

@CommandHandler(CreateVendorByAdminCommand)
export class CreateVendorByAdminHandler implements ICommandHandler<CreateVendorByAdminCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateVendorByAdminCommand): Promise<any> {
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

    const user = new User({
      email: dto.email,
      passwordHash: passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.VENDOR,
      isEmailVerified: true, // Auto-verify since admin created
      phoneNumber: dto.phone,
    });

    // We need to persist the user.
    // The repository method createUser takes Partial<UserPersistence>.

    const createdUser = await this.userRepository.createUser({
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
