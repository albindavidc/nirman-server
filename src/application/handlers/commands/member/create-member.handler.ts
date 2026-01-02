import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { CreateMemberCommand } from '../../../commands/member/create-member.command';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import { MemberResponseDto } from '../../../dto/member/member-response.dto';
import { UserRole } from '../../../../generated/client/client';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateMemberCommand)
export class CreateMemberHandler implements ICommandHandler<CreateMemberCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateMemberCommand): Promise<MemberResponseDto> {
    const { data } = command;

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password - use provided or generate default
    const rawPassword = data.password || 'Temp@1234'; // Default password for new members
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Create user with optional professional data
    const user = await this.prisma.user.create({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phone, // Front-end sends 'phone'
        password_hash: passwordHash,
        role: data.role as UserRole,
        user_status: 'active',
        professional: data.professionalTitle
          ? {
              create: {
                professional_title: data.professionalTitle,
                experience_years: data.experienceYears ?? 0,
                skills: data.skills ?? [],
                address_street: data.addressStreet ?? '',
                address_city: data.addressCity ?? '',
                address_state: data.addressState ?? '',
                address_zip_code: data.addressZipCode ?? '',
              },
            }
          : undefined,
      },
      include: { professional: true },
    });

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number ?? undefined,
      role: user.role,
      userStatus: user.user_status,
      professionalTitle: user.professional?.professional_title,
      experienceYears: user.professional?.experience_years,
      skills: user.professional?.skills,
      addressStreet: user.professional?.address_street,
      addressCity: user.professional?.address_city,
      addressState: user.professional?.address_state,
      addressZipCode: user.professional?.address_zip_code,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}
