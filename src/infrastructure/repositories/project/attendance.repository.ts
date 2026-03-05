import { Injectable } from '@nestjs/common';
import { AttendanceMapper } from '../../../application/mappers/attendance.mapper';
import { AttendanceEntity } from '../../../domain/entities/attendance.entity';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';

import { Prisma } from '../../../generated/client/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AttendanceValue } from '../../../domain/value-objects/attendance.vo';
import { RepositoryUtils } from '../repository.utils';
import { IAttendanceWriter } from '../../../domain/repositories/project-attendance/attendance.writer.interface';

@Injectable()
export class AttendanceRepository implements IAttendanceWriter {
  constructor(private readonly prisma: PrismaService) {}

  // ── Private helpers ───────────────────────────────────────────────────────

  private defaultIncludes() {
    return {
      project: { select: { id: true, name: true } },
      user: {
        select: { id: true, first_name: true, last_name: true, email: true },
      },
      verifier: { select: { id: true, first_name: true, last_name: true } },
    };
  }

  // ── Write ─────────────────────────────────────────────────────────────────

  async save(
    entity: AttendanceEntity,
    tx?: ITransactionContext,
  ): Promise<AttendanceEntity> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    const data = AttendanceMapper.toPersistence(entity);

    const createData: Prisma.AttendanceCreateInput = {
      date: data.date,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status,
      location: data.location,
      workHours: data.workHours,
      method: data.method,
      supervisorNotes: data.supervisorNotes,
      isVerified: data.isVerified,
      verifiedAt: data.verifiedAt,
      project: { connect: { id: data.projectId } },
      user: { connect: { id: data.userId } },
      ...(data.verifiedBy
        ? { verifier: { connect: { id: data.verifiedBy } } }
        : {}),
    };

    const updateData: Prisma.AttendanceUpdateInput = {
      date: data.date,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status,
      location: data.location,
      workHours: data.workHours,
      method: data.method,
      supervisorNotes: data.supervisorNotes,
      isVerified: data.isVerified,
      verifiedAt: data.verifiedAt,
      ...(data.verifiedBy
        ? { verifier: { connect: { id: data.verifiedBy } } }
        : { verifier: { disconnect: true } }),
    };

    try {
      const saved = await client.attendance.upsert({
        where: { id: data.id ?? '' },
        create: createData,
        update: updateData,
        include: this.defaultIncludes(),
      });
      return AttendanceMapper.toDomain(saved);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async softDelete(id: string, tx?: ITransactionContext): Promise<void> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      await client.attendance.update({
        where: { id },
        data: { status: AttendanceValue.ABSENT },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
