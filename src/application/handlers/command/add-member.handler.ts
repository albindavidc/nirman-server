import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AddMemberCommand } from '../../commands/add-member.command';
import {
  IUserRepository,
  USER_REPOSITORY,
  IProfessionalRepository,
  PROFESSIONAL_REPOSITORY,
} from 'src/domain/repositories';
import { User } from 'src/domain/entities/user.entity'; // Correct entity path
import { Role } from 'src/domain/enums/role.enum';

@CommandHandler(AddMemberCommand)
export class AddMemberHandler implements ICommandHandler<AddMemberCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
  ) {}

  async execute(command: AddMemberCommand): Promise<any> {
    const { email, firstName, lastName, phone, role } = command;

    // 1. Check if user exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // 2. Hash password (default password)
    const defaultPassword = process.env.DEFAULT_MEMBER_PASSWORD || 'Member@123';
    const passwordHash = await argon2.hash(defaultPassword);

    // 3. Persist User
    try {
      const createdUser = await this.userRepository.createUser({
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: role as any, // Cast to any or UserRole if imported
        phone_number: phone,
        is_email_verified: true,
        user_status: 'active',
      } as any);

      // 4. Create professional profile for all members (worker and supervisor)
      // This stores skills, experience, and address information
      if (role === Role.SUPERVISOR || role === Role.WORKER) {
        await this.professionalRepository.create({
          user_id: createdUser.id,
          professional_title:
            command.professionalTitle ||
            (role === Role.WORKER ? 'Worker' : 'Supervisor'),
          experience_years: command.experienceYears || 0,
          skills: command.skills || [],
          address_street: command.addressStreet || '',
          address_city: command.addressCity || '',
          address_state: command.addressState || '',
          address_zip_code: command.addressZipCode || '',
        });
      }

      return createdUser;
    } catch (error) {
      throw new Error('Failed to create user: ' + error.message);
    }
  }
}
