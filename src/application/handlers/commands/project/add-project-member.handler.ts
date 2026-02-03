import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { AddProjectMemberCommand } from '../../../commands/project/add-project-member.command';
import {
  IProjectMemberRepository,
  PROJECT_MEMBER_REPOSITORY,
} from '../../../../domain/repositories/project-member-repository.interface';
import {
  IProfessionalRepository,
  PROFESSIONAL_REPOSITORY,
} from '../../../../domain/repositories/professional-repository.interface';

@CommandHandler(AddProjectMemberCommand)
export class AddProjectMemberHandler implements ICommandHandler<AddProjectMemberCommand> {
  constructor(
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: IProjectMemberRepository,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
  ) {}

  async execute(command: AddProjectMemberCommand): Promise<{
    message: string;
    addedCount: number;
    members: Array<{
      userId: string;
      role: string;
      joinedAt: Date;
      isCreator: boolean;
    }>;
  }> {
    const { projectId, userIds, role } = command;

    // Verify all users are professionals
    const verifiedProfessionalIds =
      await this.professionalRepository.verifyProfessionals(userIds);

    if (verifiedProfessionalIds.length !== userIds.length) {
      throw new BadRequestException(
        'One or more users are not professionals. Only professionals can be added to projects.',
      );
    }

    // Add members to project
    const result = await this.projectMemberRepository.addMembers(
      projectId,
      userIds.map((userId) => ({ userId, role })),
    );

    if (result.addedCount === 0) {
      throw new BadRequestException(
        'All selected professionals are already members of this project.',
      );
    }

    return {
      message: `${result.addedCount} member(s) added successfully`,
      addedCount: result.addedCount,
      members: result.members,
    };
  }
}
