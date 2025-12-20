import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Professional } from 'src/generated/client/client';
import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { AddMemberCommand } from '../commands/add-member.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/repositories/user-repository.interface';
import {
  IProfessionalRepository,
  PROFESSIONAL_REPOSITORY,
} from 'src/modules/member/domain/repositories/professional-repository.interface';
import { Role } from 'src/shared/domain/enums/role.enum';
import { MemberResponseDto } from '../dto/member.response.dto';
import { UserMapper } from 'src/modules/user/infrastructure/persistence/user.mapper';
import { MemberMapper } from '../mappers/member.mapper';

@CommandHandler(AddMemberCommand)
export class AddMemberHandler implements ICommandHandler<AddMemberCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
  ) {}

  async execute(command: AddMemberCommand): Promise<MemberResponseDto> {
    const { email, firstName, lastName, phone, role } = command.dto;

    // 1. Check if user exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // 2. Hash password (default password)
    const defaultPassword = process.env.DEFAULT_MEMBER_PASSWORD || 'Member@123';
    const passwordHash = await argon2.hash(defaultPassword);

    try {
      // 3. Create User record
      const persistenceData = {
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: role,
        phone_number: phone,
        is_email_verified: true,
        user_status: 'active',
      };

      const createdPersistence =
        await this.userRepository.create(persistenceData);
      const user = UserMapper.persistenceToEntity(createdPersistence);

      let professional: Professional | null = null;

      // 4. Create professional profile for all members (worker and supervisor)
      if (role === Role.SUPERVISOR || role === Role.WORKER) {
        professional = await this.professionalRepository.create({
          user_id: user.id,
          professional_title:
            command.dto.professionalTitle ||
            (role === Role.WORKER ? 'Worker' : 'Supervisor'),
          experience_years: command.dto.experienceYears || 0,
          skills: command.dto.skills || [],
          address_street: command.dto.addressStreet || '',
          address_city: command.dto.addressCity || '',
          address_state: command.dto.addressState || '',
          address_zip_code: command.dto.addressZipCode || '',
        });
      }

      // 5. Map to response DTO
      return MemberMapper.toResponse(user, professional);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Internal Server Error';
      throw new InternalServerErrorException(
        'Failed to create member',
        errorMessage,
      );
    }
  }
}
