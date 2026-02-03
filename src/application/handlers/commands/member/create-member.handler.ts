import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateMemberCommand } from '../../../commands/member/create-member.command';
import { MemberResponseDto } from '../../../dto/member/member-response.dto';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member-repository.interface';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateMemberCommand)
export class CreateMemberHandler implements ICommandHandler<CreateMemberCommand> {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: CreateMemberCommand): Promise<MemberResponseDto> {
    const { data } = command;

    // Check if email already exists
    const existingUser = await this.memberRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password - use provided or generate default
    const rawPassword = data.password || 'Temp@1234';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Create member with optional professional data
    const member = await this.memberRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phone,
      passwordHash,
      role: data.role,
      professional: data.professionalTitle
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
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber ?? undefined,
      role: member.role,
      userStatus: member.userStatus,
      professionalTitle: member.professionalTitle,
      experienceYears: member.experienceYears,
      skills: member.skills,
      addressStreet: member.addressStreet,
      addressCity: member.addressCity,
      addressState: member.addressState,
      addressZipCode: member.addressZipCode,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
