import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMembersQuery } from '../../../queries/member/get-members.query';
import {
  MemberResponseDto,
  MemberListResponseDto,
} from '../../../dto/member/member-response.dto';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../../domain/repositories/member-repository.interface';

@QueryHandler(GetMembersQuery)
export class GetMembersHandler implements IQueryHandler<GetMembersQuery> {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(query: GetMembersQuery): Promise<MemberListResponseDto> {
    const { page, limit, role, search } = query;

    const { members, total } = await this.memberRepository.findAllWithFilters({
      page,
      limit,
      role,
      search,
    });

    const data: MemberResponseDto[] = members.map((member) => ({
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
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
