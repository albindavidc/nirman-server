import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectPhase } from '../../../domain/entities/project-phase.entity';
import { ProjectPhaseMapper } from '../../../application/mappers/project-phase.mapper';
import { IProjectPhaseWriter } from '../../../domain/repositories/project-phase/project-phase.writer.interface';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { RepositoryUtils } from '../repository.utils';
import { ProjectPhaseStatus } from '../../../domain/enums/project-phase-status.enum';

@Injectable()
export class ProjectPhaseRepository implements IProjectPhaseWriter {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    phase: ProjectPhase,
    tx?: ITransactionContext,
  ): Promise<ProjectPhase> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const result = await client.projectPhase.upsert({
        where: { id: phase.id || '' },
        create: ProjectPhaseMapper.toCreateInput(phase),
        update: ProjectPhaseMapper.toUpdateInput(phase),
      });
      return ProjectPhaseMapper.toDomain(result);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async softDelete(id: string, tx?: ITransactionContext): Promise<void> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
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
