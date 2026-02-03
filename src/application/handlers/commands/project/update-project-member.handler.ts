import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateProjectMemberCommand } from '../../../commands/project/update-project-member.command';
import {
  IProjectMemberRepository,
  PROJECT_MEMBER_REPOSITORY,
} from '../../../../domain/repositories/project-member-repository.interface';

@CommandHandler(UpdateProjectMemberCommand)
export class UpdateProjectMemberHandler implements ICommandHandler<UpdateProjectMemberCommand> {
  constructor(
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: IProjectMemberRepository,
  ) {}

  async execute(command: UpdateProjectMemberCommand): Promise<void> {
    const { projectId, userId, role } = command;

    await this.projectMemberRepository.updateMemberRole(
      projectId,
      userId,
      role,
    );
  }
}
