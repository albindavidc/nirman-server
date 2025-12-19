import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMembersQuery } from '../queries/get-members.query';
import { IUserRepository, USER_REPOSITORY } from 'src/modules/user/domain/repositories/IUserRepository';

@QueryHandler(GetMembersQuery)
export class GetMembersHandler implements IQueryHandler<GetMembersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetMembersQuery): Promise<any> {
    // Fetch all users from repository
    const users = await this.userRepository.findAll();

    // Only include workers and supervisors in project members
    const allowedRoles = ['worker', 'supervisor'];
    let filteredUsers = users.filter((u) => allowedRoles.includes(u.role));

    // Further filter by role if provided in query (must still be worker or supervisor)
    if (query.role && allowedRoles.includes(query.role)) {
      filteredUsers = filteredUsers.filter((u) => u.role === query.role);
    }

    if (query.search) {
      const lowerSearch = query.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.first_name.toLowerCase().includes(lowerSearch) ||
          u.last_name.toLowerCase().includes(lowerSearch) ||
          u.email.toLowerCase().includes(lowerSearch),
      );
    }

    // Pagination (in memory for now as repo is simple)
    const start = (query.page - 1) * query.limit;
    const end = start + query.limit;
    const paginatedUsers = filteredUsers.slice(start, end);

    // Map users to include professional fields for frontend
    const mappedData = paginatedUsers.map((user: any) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone_number,
      role: user.role,
      userStatus: user.user_status,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      // Professional fields (from related professional record)
      professionalTitle: user.professional?.professional_title || null,
      experienceYears: user.professional?.experience_years || null,
      skills: user.professional?.skills || [],
      addressStreet: user.professional?.address_street || null,
      addressCity: user.professional?.address_city || null,
      addressState: user.professional?.address_state || null,
      addressZipCode: user.professional?.address_zip_code || null,
    }));

    return {
      data: mappedData,
      total: filteredUsers.length,
      page: query.page,
      limit: query.limit,
    };
  }
}
