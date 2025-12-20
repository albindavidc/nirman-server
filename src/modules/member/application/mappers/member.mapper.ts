import { User } from 'src/modules/user/domain/entities/user.entity';
import { Professional } from 'src/generated/client/client';
import { MemberResponseDto } from '../dto/member.response.dto';

export class MemberMapper {
  static toResponse(
    user: User,
    professional?: Professional | null,
  ): MemberResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phoneNumber ?? '',
      role: user.role,
      status: user.userStatus,
      professionalTitle: professional?.professional_title ?? undefined,
      experienceYears: professional?.experience_years ?? undefined,
      skills: professional?.skills
        ? Array.isArray(professional.skills)
          ? professional.skills
          : []
        : undefined, // Ensure array
      addressStreet: professional?.address_street ?? undefined,
      addressCity: professional?.address_city ?? undefined,
      addressState: professional?.address_state ?? undefined,
      addressZipCode: professional?.address_zip_code ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
