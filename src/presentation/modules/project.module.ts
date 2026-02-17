import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { ProjectRepository } from '../../infrastructure/repositories/project.repository';
import { ProjectPhaseRepository } from '../../infrastructure/repositories/project-phase.repository';
import { ProjectMemberRepository } from '../../infrastructure/repositories/project-member.repository';
import { PhaseApprovalRepository } from '../../infrastructure/repositories/phase-approval.repository';
import { AttendanceRepository } from '../../infrastructure/repositories/attendance.repository';
import { ProfessionalRepository } from '../../infrastructure/repositories/professional.repository';

// Domain interfaces
import { PROJECT_REPOSITORY } from '../../domain/repositories/project-repository.interface';
import { PROJECT_PHASE_REPOSITORY } from '../../domain/repositories/project-phase-repository.interface';
import { PROJECT_MEMBER_REPOSITORY } from '../../domain/repositories/project-member-repository.interface';
import { PHASE_APPROVAL_REPOSITORY } from '../../domain/repositories/phase-approval-repository.interface';
import { ATTENDANCE_REPOSITORY } from '../../domain/repositories/attendance-repository.interface';
import { PROFESSIONAL_REPOSITORY } from '../../domain/repositories/professional-repository.interface';

// Controllers
import { ProjectController } from '../controllers/project.controller';

// Query Handlers
import { GetProjectsHandler } from '../../application/handlers/queries/project/get-projects.handler';
import { GetProjectByIdHandler } from '../../application/handlers/queries/project/get-project-by-id.handler';
import { GetProjectAttendanceHandler } from '../../application/handlers/queries/project/get-project-attendance.handler';
import { GetProfessionalsHandler } from '../../application/handlers/queries/project/get-professionals.handler';
import { GetProjectMembersHandler } from '../../application/handlers/queries/project/get-project-members.handler';
import { GetProjectPhasesHandler } from '../../application/handlers/queries/project/get-project-phases.handler';
import { GetProjectStatsHandler } from '../../application/handlers/queries/project/get-project-stats.handler';
import { ExportProjectAttendanceHandler } from '../../application/handlers/queries/project/export-project-attendance.handler';

// Command Handlers
import { CreateProjectHandler } from '../../application/handlers/commands/project/create-project.handler';
import { UpdateProjectHandler } from '../../application/handlers/commands/project/update-project.handler';
import { DeleteProjectHandler } from '../../application/handlers/commands/project/delete-project.handler';
import { AddProjectMemberHandler } from '../../application/handlers/commands/project/add-project-member.handler';
import { RemoveProjectMemberHandler } from '../../application/handlers/commands/project/remove-project-member.handler';
import { UpdateProjectMemberHandler } from '../../application/handlers/commands/project/update-project-member.handler';
import { CreateProjectPhaseHandler } from '../../application/handlers/commands/project/create-project-phase.handler';
import { UpdateProjectPhaseHandler } from '../../application/handlers/commands/project/update-project-phase.handler';

// Phase Approval Handlers
import { GetPhaseForApprovalHandler } from '../../application/handlers/queries/phase-approval/get-phase-for-approval.handler';
import { CreatePhaseApprovalHandler } from '../../application/handlers/commands/phase-approval/create-phase-approval.handler';

import { RequestPhaseApprovalHandler } from '../../application/handlers/commands/phase-approval/request-phase-approval.handler';

import { GetProjectApprovalsHandler } from '../../application/handlers/queries/phase-approval/get-project-approvals.handler';
import { GetAllPhaseApprovalsHandler } from '../../application/handlers/queries/phase-approval/get-all-phase-approvals.handler';

const QueryHandlers = [
  GetProjectsHandler,
  GetProjectByIdHandler,
  GetProjectAttendanceHandler,
  GetProjectPhasesHandler,
  GetProfessionalsHandler,
  GetProjectMembersHandler,
  ExportProjectAttendanceHandler,
  GetPhaseForApprovalHandler,
  GetProjectStatsHandler,
  GetProjectApprovalsHandler,
  GetAllPhaseApprovalsHandler,
];

const CommandHandlers = [
  CreateProjectHandler,
  UpdateProjectHandler,
  DeleteProjectHandler,
  CreateProjectPhaseHandler,
  UpdateProjectPhaseHandler,
  AddProjectMemberHandler,
  RemoveProjectMemberHandler,
  UpdateProjectMemberHandler,
  CreatePhaseApprovalHandler,
  RequestPhaseApprovalHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ProjectController],
  providers: [
    // Repository bindings
    { provide: PROJECT_REPOSITORY, useClass: ProjectRepository },
    { provide: PROJECT_PHASE_REPOSITORY, useClass: ProjectPhaseRepository },
    { provide: PROJECT_MEMBER_REPOSITORY, useClass: ProjectMemberRepository },
    { provide: PHASE_APPROVAL_REPOSITORY, useClass: PhaseApprovalRepository },
    { provide: ATTENDANCE_REPOSITORY, useClass: AttendanceRepository },
    { provide: PROFESSIONAL_REPOSITORY, useClass: ProfessionalRepository },
    // Handlers
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class ProjectModule {}
