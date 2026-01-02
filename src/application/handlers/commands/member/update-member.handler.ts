import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateMemberCommand } from '../../../commands/member/update-member.command';
import { PrismaService } from '../../../../infrastructure/persistence/prisma/prisma.service';
import { MemberResponseDto } from '../../../dto/member/member-response.dto';
import { UserRole } from '../../../../generated/client/client';

@CommandHandler(UpdateMemberCommand)
export class UpdateMemberHandler implements ICommandHandler<UpdateMemberCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UpdateMemberCommand): Promise<MemberResponseDto> {
    const { id, data } = command;

    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: { professional: true },
    });

    if (!existingUser) {
      throw new NotFoundException('Member not found');
    }

    // Update user data
    await this.prisma.user.update({
      where: { id },
      data: {
        first_name: data.firstName ?? existingUser.first_name,
        last_name: data.lastName ?? existingUser.last_name,
        email: data.email ?? existingUser.email,
        phone_number: data.phone ?? existingUser.phone_number,
        role: data.role ? (data.role as UserRole) : existingUser.role,
      },
    });

    // Update professional data if exists or create if needed
    if (
      data.professionalTitle ||
      data.experienceYears ||
      data.skills ||
      data.addressStreet ||
      data.addressCity ||
      data.addressState ||
      data.addressZipCode
    ) {
      if (existingUser.professional) {
        await this.prisma.professional.update({
          where: { user_id: id },
          data: {
            professional_title:
              data.professionalTitle ??
              existingUser.professional.professional_title,
            experience_years:
              data.experienceYears ??
              existingUser.professional.experience_years,
            skills: data.skills ?? existingUser.professional.skills,
            address_street:
              data.addressStreet ?? existingUser.professional.address_street,
            address_city:
              data.addressCity ?? existingUser.professional.address_city,
            address_state:
              data.addressState ?? existingUser.professional.address_state,
            address_zip_code:
              data.addressZipCode ?? existingUser.professional.address_zip_code,
          },
        });
      } else {
        await this.prisma.professional.create({
          data: {
            user_id: id,
            professional_title: data.professionalTitle ?? '',
            experience_years: data.experienceYears ?? 0,
            skills: data.skills ?? [],
            address_street: data.addressStreet ?? '',
            address_city: data.addressCity ?? '',
            address_state: data.addressState ?? '',
            address_zip_code: data.addressZipCode ?? '',
          },
        });
      }
    }

    // Refetch with updated professional
    const updatedUser = await this.prisma.user.findUnique({
      where: { id },
      include: { professional: true },
    });

    return {
      id: updatedUser!.id,
      firstName: updatedUser!.first_name,
      lastName: updatedUser!.last_name,
      email: updatedUser!.email,
      phoneNumber: updatedUser!.phone_number ?? undefined,
      role: updatedUser!.role,
      userStatus: updatedUser!.user_status,
      professionalTitle: updatedUser!.professional?.professional_title,
      experienceYears: updatedUser!.professional?.experience_years,
      skills: updatedUser!.professional?.skills,
      addressStreet: updatedUser!.professional?.address_street,
      addressCity: updatedUser!.professional?.address_city,
      addressState: updatedUser!.professional?.address_state,
      addressZipCode: updatedUser!.professional?.address_zip_code,
      createdAt: updatedUser!.created_at,
      updatedAt: updatedUser!.updated_at,
    };
  }
}
