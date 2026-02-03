import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectPhase } from '../../../../domain/entities/project-phase.entity';
import { ProjectPhaseMapper } from '../../../../application/mappers/project-phase.mapper';
import {
  IProjectPhaseRepository,
  UpdateProjectPhaseData,
  PhaseWithApprovals,
} from '../../../../domain/repositories/project-phase-repository.interface';
import { Prisma } from '../../../../generated/client/client';

@Injectable()
export class ProjectPhaseRepository implements IProjectPhaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ProjectPhase | null> {
    const phase = await this.prisma.projectPhase.findUnique({
      where: { id },
    });
    return phase ? ProjectPhaseMapper.toDomain(phase) : null;
  }

  async findByProjectId(projectId: string): Promise<ProjectPhase[]> {
    const phases = await this.prisma.projectPhase.findMany({
      where: { project_id: projectId },
      orderBy: { sequence: 'asc' },
    });
    return phases.map((phase) => ProjectPhaseMapper.toDomain(phase));
  }

  async findWithApprovals(phaseId: string): Promise<PhaseWithApprovals | null> {
    // Cast include to any to allow 'tasks' relation if it's not yet in the generated type
    const phase: any = await this.prisma.projectPhase.findUnique({
      where: { id: phaseId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            budget: true,
            spent: true,
          },
        },
        approvals: {
          include: {
            approver: {
              select: { first_name: true, last_name: true },
            },
            requester: {
              select: { first_name: true, last_name: true },
            },
          },
          orderBy: { created_at: 'desc' },
        },
        tasks: {
          select: { status: true },
        },
      } as any,
    });

    if (!phase) {
      return null;
    }

    return {
      phase: ProjectPhaseMapper.toDomain(phase),
      project: {
        id: phase.project.id,
        name: phase.project.name,
        budget: phase.project.budget,
        spent: phase.project.spent,
      },
      approvals: phase.approvals.map((a) => ({
        id: a.id,
        phaseId: a.phase_id,
        approvedBy: a.approved_by,
        approverName: a.approver
          ? `${a.approver.first_name} ${a.approver.last_name}`
          : null,
        requestedBy: a.requested_by,
        requesterName: `${a.requester.first_name} ${a.requester.last_name}`,
        approvalStatus: a.approval_status,
        comments: a.comments,
        media: (a.media as Array<{ type: string; url: string }>) ?? [],
        approvedAt: a.approved_at,
        createdAt: a.created_at,
      })),
      taskStats: {
        total: phase.tasks.length,
        completed: phase.tasks.filter((t: any) => t.status === 'Completed')
          .length,
      },
    };
  }

  async create(phase: ProjectPhase): Promise<ProjectPhase> {
    const data = ProjectPhaseMapper.toPersistence(phase);
    const created = await this.prisma.projectPhase.create({
      data: data as Prisma.ProjectPhaseUncheckedCreateInput,
    });
    return ProjectPhaseMapper.toDomain(created);
  }

  async update(
    id: string,
    data: UpdateProjectPhaseData,
  ): Promise<ProjectPhase> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.sequence !== undefined) updateData.sequence = data.sequence;
    if (data.plannedStartDate !== undefined) {
      updateData.planned_start_date = data.plannedStartDate;
    }
    if (data.plannedEndDate !== undefined) {
      updateData.planned_end_date = data.plannedEndDate;
    }
    if (data.actualStartDate !== undefined) {
      updateData.actual_start_date = data.actualStartDate;
    }
    if (data.actualEndDate !== undefined) {
      updateData.actual_end_date = data.actualEndDate;
    }

    // Auto-set dates based on status change
    if (data.status === 'In Progress' && !data.actualStartDate) {
      updateData.actual_start_date = new Date();
    }
    if (data.status === 'Completed' && !data.actualEndDate) {
      updateData.actual_end_date = new Date();
      updateData.progress = 100;
    }

    const updatedPhase = await this.prisma.projectPhase.update({
      where: { id },
      data: updateData,
    });

    return ProjectPhaseMapper.toDomain(updatedPhase);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.prisma.projectPhase.update({
      where: { id },
      data: { status },
    });
  }
}
