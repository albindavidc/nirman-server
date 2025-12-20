import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { EditMemberCommand } from '../commands/edit-member.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/repositories/user-repository.interface';
import {
  IProfessionalRepository,
  PROFESSIONAL_REPOSITORY,
} from 'src/modules/member/domain/repositories/professional-repository.interface';
import { Role } from 'src/shared/domain/enums/role.enum';
import { UserPersistence } from 'src/modules/user/domain/repositories/user-repository.interface';

@CommandHandler(EditMemberCommand)
export class EditMemberHandler implements ICommandHandler<EditMemberCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
  ) {}

  async execute(command: EditMemberCommand): Promise<UserPersistence> {
    const { id } = command;
    const { email, firstName, lastName, phone, role } = command.dto;

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Update User
    const updatedUser = await this.userRepository.update(id, {
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      // role updating requires caution, skipping for now as per plan focus
    });

    // Update Professional Details if role is Supervisor or Worker
    if (role === Role.SUPERVISOR || role === Role.WORKER) {
      const existingProfessional =
        await this.professionalRepository.findByUserId(id);

      const professionalData = {
        professional_title: command.dto.professionalTitle,
        experience_years: command.dto.experienceYears,
        skills: command.dto.skills,
        address_street: command.dto.addressStreet,
        address_city: command.dto.addressCity,
        address_state: command.dto.addressState,
        address_zip_code: command.dto.addressZipCode,
      };

      if (existingProfessional) {
        await this.professionalRepository.update(id, professionalData);
      } else {
        // Create if missing but role is supervisor/worker
        await this.professionalRepository.create({
          user_id: id,
          ...professionalData,
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
    }

    return updatedUser;
  }
}
