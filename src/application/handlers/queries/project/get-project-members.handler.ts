import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectMembersQuery } from '../../../queries/project/get-project-members.query';
import {
  IProjectMemberRepository,
  PROJECT_MEMBER_REPOSITORY,
  ProjectMemberWithUser,
} from '../../../../domain/repositories/project-member-repository.interface';

interface ProjectMemberResponse {
  userId: string;
  role: string;
  joinedAt: Date;
  isCreator: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string | null;
    profilePhoto: string | null;
    title: string;
  } | null;
}

@QueryHandler(GetProjectMembersQuery)
export class GetProjectMembersHandler implements IQueryHandler<GetProjectMembersQuery> {
  constructor(
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: IProjectMemberRepository,
  ) {}

  async execute(
    query: GetProjectMembersQuery,
  ): Promise<ProjectMemberResponse[]> {
    const { projectId } = query;

    const members =
      await this.projectMemberRepository.findByProjectId(projectId);

    return members.map((member: ProjectMemberWithUser) => ({
      userId: member.userId,
      role: member.role,
      joinedAt: member.joinedAt,
      isCreator: member.isCreator,
      user: member.user,
    }));
  }
}
