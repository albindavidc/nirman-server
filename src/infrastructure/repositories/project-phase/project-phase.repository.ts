import { Injectable } from '@nestjs/common';
import { ProjectPhaseMapper } from '../../../application/mappers/project-phase.mapper';
import { ProjectPhase } from '../../../domain/entities/project-phase.entity';
import { ProjectPhaseStatus } from '../../../domain/enums/project-phase-status.enum';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { IProjectPhaseWriter } from '../../../domain/repositories/project-phase/project-phase.writer.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { RepositoryUtils } from '../repository.utils';
import { PrismaClient } from '../../../generated/client/client';

@Injectable()
export class ProjectPhaseRepository implements IProjectPhaseWriter {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    phase: ProjectPhase,
    tx?: ITransactionContext,
  ): Promise<ProjectPhase> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      // if the phase has an ID then treat this as an update, otherwise create
      if (phase.id) {
        const result = await client.projectPhase.update({
          where: { id: phase.id },
          data: ProjectPhaseMapper.toUpdateInput(phase),
        });
        return ProjectPhaseMapper.toDomain(result);
      } else {
        // omit id from create input so prisma will auto-generate one
        const createData = ProjectPhaseMapper.toCreateInput(phase);
        const result = await client.projectPhase.create({
          data: createData as any,
        }); // Keep any for dynamic object here if needed, but project_phase is name fix
        return ProjectPhaseMapper.toDomain(result);
      }
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async softDelete(id: string, tx?: ITransactionContext): Promise<void> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      await client.projectPhase.update({
        where: { id },
        data: { status: ProjectPhaseStatus.DELETED },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
