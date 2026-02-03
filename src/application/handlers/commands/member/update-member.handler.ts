import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateMemberCommand } from '../../../commands/member/update-member.command';
import { MemberResponseDto } from '../../../dto/member/member-response.dto';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member-repository.interface';

@CommandHandler(UpdateMemberCommand)
export class UpdateMemberHandler implements ICommandHandler<UpdateMemberCommand> {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: UpdateMemberCommand): Promise<MemberResponseDto> {
    const { id, data } = command;

    // Check if member exists
    const existingMember = await this.memberRepository.findById(id);

    if (!existingMember) {
      throw new NotFoundException('Member not found');
    }

    // Build professional data if any professional fields are provided
    const hasProfessionalData =
      data.professionalTitle !== undefined ||
      data.experienceYears !== undefined ||
      data.skills !== undefined ||
      data.addressStreet !== undefined ||
      data.addressCity !== undefined ||
      data.addressState !== undefined ||
      data.addressZipCode !== undefined;

    // Update member
    const updatedMember = await this.memberRepository.update(id, {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phone,
      role: data.role,
      professional: hasProfessionalData
        ? {
            professionalTitle: data.professionalTitle,
            experienceYears: data.experienceYears,
            skills: data.skills,
            addressStreet: data.addressStreet,
            addressCity: data.addressCity,
            addressState: data.addressState,
            addressZipCode: data.addressZipCode,
          }
        : undefined,
    });

    return {
      id: updatedMember.id,
      firstName: updatedMember.firstName,
      lastName: updatedMember.lastName,
      email: updatedMember.email,
      phoneNumber: updatedMember.phoneNumber ?? undefined,
      role: updatedMember.role,
      userStatus: updatedMember.userStatus,
      professionalTitle: updatedMember.professionalTitle,
      experienceYears: updatedMember.experienceYears,
      skills: updatedMember.skills,
      addressStreet: updatedMember.addressStreet,
      addressCity: updatedMember.addressCity,
      addressState: updatedMember.addressState,
      addressZipCode: updatedMember.addressZipCode,
      createdAt: updatedMember.createdAt,
      updatedAt: updatedMember.updatedAt,
    };
  }
}
