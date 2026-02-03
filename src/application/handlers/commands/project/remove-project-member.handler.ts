import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RemoveProjectMemberCommand } from '../../../commands/project/remove-project-member.command';
import {
  IProjectMemberRepository,
  PROJECT_MEMBER_REPOSITORY,
} from '../../../../domain/repositories/project-member-repository.interface';

@CommandHandler(RemoveProjectMemberCommand)
export class RemoveProjectMemberHandler implements ICommandHandler<RemoveProjectMemberCommand> {
  constructor(
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: IProjectMemberRepository,
  ) {}

  async execute(command: RemoveProjectMemberCommand): Promise<{
    message: string;
    members: Array<{
      userId: string;
      role: string;
      joinedAt: Date;
      isCreator: boolean;
    }>;
  }> {
    const { projectId, userId } = command;

    const members = await this.projectMemberRepository.removeMember(
      projectId,
      userId,
    );

    return {
      message: 'Member removed successfully',
      members,
    };
  }
}
