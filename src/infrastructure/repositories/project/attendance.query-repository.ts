import { Injectable } from '@nestjs/common';
import { AttendanceMapper } from '../../../application/mappers/attendance.mapper';
import { AttendanceEntity } from '../../../domain/entities/attendance.entity';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import {
  AttendanceFilter,
  AttendanceSummary,
  PaginatedAttendance,
} from '../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceQueryReader } from '../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import { Prisma } from '../../../generated/client/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RepositoryUtils } from '../repository.utils';

@Injectable()
export class AttendanceQueryRepository implements IAttendanceQueryReader {
  constructor(private readonly prisma: PrismaService) {}

  private defaultIncludes() {
    return {
      project: { select: { id: true, name: true } },
      user: {
        select: { id: true, first_name: true, last_name: true, email: true },
      },
      verifier: { select: { id: true, first_name: true, last_name: true } },
    };
  }

  private todayRange() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    return { todayStart, tomorrowStart };
  }

  private countWorkingDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  async findTodayByUser(
    userId: string,
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<AttendanceEntity | null> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    const { todayStart, tomorrowStart } = this.todayRange();
    try {
      const record = await client.attendance.findFirst({
        where: {
          userId,
          projectId,
          date: { gte: todayStart, lte: tomorrowStart },
        },
        include: this.defaultIncludes(),
      });
      return record ? AttendanceMapper.toDomain(record) : null;
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }

  async existsTodayForUser(
    userId: string,
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<boolean> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    const { todayStart, tomorrowStart } = this.todayRange();
    try {
      const count = await client.attendance.count({
        where: {
          userId,
          projectId,
          date: { gte: todayStart, lte: tomorrowStart },
        },
      });
      return count > 0;
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByUserPaginated(
    userId: string,
    filters: AttendanceFilter,
    tx?: ITransactionContext,
  ): Promise<PaginatedAttendance> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    const where: Prisma.AttendanceWhereInput = { userId };

    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.status) where.status = filters.status;
    if (filters.startDate && filters.endDate) {
      where.date = { gte: filters.startDate, lte: filters.endDate };
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    try {
      const [records, total] = await Promise.all([
        client.attendance.findMany({
          where,
          skip,
          take: limit,
          orderBy: { date: 'desc' },
        }),
        client.attendance.count({ where }),
      ]);

      return {
        data: records.map((r) => AttendanceMapper.toDomain(r)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }

  async getSummaryByUser(
    userId: string,
    projectId?: string,
    tx?: ITransactionContext,
  ): Promise<AttendanceSummary> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const baseWhere: Prisma.AttendanceWhereInput = { userId };
    if (projectId) baseWhere.projectId = projectId;

    try {
      const [weekAgg, monthAgg, presentCount, lateCount] = await Promise.all([
        client.attendance.aggregate({
          where: { ...baseWhere, date: { gte: startOfWeek } },
          _sum: { workHours: true },
        }),
        client.attendance.aggregate({
          where: { ...baseWhere, date: { gte: startOfMonth } },
          _sum: { workHours: true },
        }),
        client.attendance.count({
          where: {
            ...baseWhere,
            date: { gte: startOfMonth },
            status: { not: 'Absent' },
          },
        }),
        client.attendance.count({
          where: {
            ...baseWhere,
            date: { gte: startOfMonth },
            status: 'Late',
          },
        }),
      ]);

      const weeklyHours = Math.round((weekAgg._sum.workHours ?? 0) * 10) / 10;

      const monthlyHours = Math.round((monthAgg._sum.workHours ?? 0) * 10) / 10;

      const workingDays = this.countWorkingDays(startOfMonth, now);
      const attendanceRate =
        workingDays > 0 ? Math.round((presentCount / workingDays) * 100) : 0;

      return {
        weeklyHours,
        monthlyHours,
        attendanceRate,
        lateArrivals: lateCount,
      };
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByProjectAndDateRange(
    projectId: string,
    startDate: Date,
    endDate: Date,
    tx?: ITransactionContext,
  ): Promise<AttendanceEntity[]> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const records = await client.attendance.findMany({
        where: { projectId, date: { gte: startDate, lte: endDate } },
        include: this.defaultIncludes(),
      });
      return records.map((r) => AttendanceMapper.toDomain(r));
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByUserProjectAndDateRange(
    userId: string,
    projectId: string,
    startDate: Date,
    endDate: Date,
    tx?: ITransactionContext,
  ): Promise<AttendanceEntity[]> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const records = await client.attendance.findMany({
        where: {
          userId,
          projectId,
          date: { gte: startDate, lte: endDate },
        },
        orderBy: { date: 'desc' },
        include: this.defaultIncludes(),
      });
      return records.map((r) => AttendanceMapper.toDomain(r));
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }
}
