import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AttendanceFilter,
  AttendanceSummary,
  IAttendanceRepository,
  PaginatedAttendance,
} from '../../domain/repositories/attendance-repository.interface';
import { AttendanceMapper } from '../mappers/attendance.mapper';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { Prisma } from '../../generated/client/client';

@Injectable()
export class AttendanceRepository implements IAttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helpers
   */
  private defaultIncludes() {
    return {
      project: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true } },
      verifier: { select: { id: true, name: true } },
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

  /**
   * Read
   */

  async findById(id: string): Promise<AttendanceEntity | null> {
    const record = await this.prisma.attendance.findUnique({
      where: { id },
      include: this.defaultIncludes(),
    });

    return record ? AttendanceMapper.toDomain(record) : null;
  }

  async findTodayByUser(
    userId: string,
    projectId: string,
  ): Promise<AttendanceEntity | null> {
    const { todayStart, tomorrowStart } = this.todayRange();

    const record = await this.prisma.attendance.findFirst({
      where: {
        userId: userId,
        projectId: projectId,
        date: {
          gte: todayStart,
          lte: tomorrowStart,
        },
      },
      include: this.defaultIncludes(),
    });

    return record ? AttendanceMapper.toDomain(record) : null;
  }

  async existsTodayForUser(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    const { todayStart, tomorrowStart } = this.todayRange();

    const count = await this.prisma.attendance.count({
      where: {
        userId: userId,
        projectId: projectId,
        date: {
          gte: todayStart,
          lte: tomorrowStart,
        },
      },
    });

    return count > 0;
  }

  async findByUserPaginated(
    userId: string,
    filters: AttendanceFilter,
  ): Promise<PaginatedAttendance> {
    const where: Prisma.AttendanceWhereInput = { userId };

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate && filters.endDate) {
      where.date = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return {
      data: records.map((record) => AttendanceMapper.toDomain(record)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSummaryByUser(
    userId: string,
    projectId?: string,
  ): Promise<AttendanceSummary> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const baseWhere: Prisma.AttendanceWhereInput = { userId: userId };
    if (projectId) baseWhere.projectId = projectId;

    const [weekRecords, monthRecords, presentCount, lateCount] =
      await Promise.all([
        this.prisma.attendance.aggregate({
          where: { ...baseWhere, date: { gte: startOfWeek } },
          _sum: { workHours: true },
        }),
        this.prisma.attendance.aggregate({
          where: { ...baseWhere, date: { gte: startOfMonth } },
          _sum: { workHours: true },
        }),
        this.prisma.attendance.count({
          where: {
            ...baseWhere,
            date: { gte: startOfMonth },
            status: { not: 'Absent' },
          },
        }),
        this.prisma.attendance.count({
          where: { ...baseWhere, date: { gte: startOfMonth }, status: 'Late' },
        }),
      ]);

    const weeklyHours = weekRecords._sum.workHours
      ? Math.round(weekRecords._sum.workHours * 10) / 10
      : 0;

    const monthlyHours =
      Math.round(
        monthRecords._sum.workHours ? monthRecords._sum.workHours * 10 : 0,
      ) / 10;

    const workingDays = this.countWorkingDays(startOfMonth, now);
    const attendanceRate =
      workingDays > 0 ? Math.round((presentCount / workingDays) * 100) : 0;

    return {
      weeklyHours,
      monthlyHours,
      attendanceRate,
      lateArrivals: lateCount,
    };
  }

  /**
   * Write
   */
  async save(entity: AttendanceEntity): Promise<AttendanceEntity> {
    const data = AttendanceMapper.toPersistence(entity);
    const { id, ...dataWithoutId } = data;

    let savedRecord;

    if (!id) {
      savedRecord = await this.prisma.attendance.create({
        data: dataWithoutId,
      });
    } else {
      savedRecord = await this.prisma.attendance.update({
        where: { id: id },
        data: dataWithoutId,
      });
    }
    return AttendanceMapper.toDomain(savedRecord);
  }

  async update(entity: AttendanceEntity): Promise<AttendanceEntity> {
    const data = AttendanceMapper.toPersistence(entity);
    const record = await this.prisma.attendance.update({
      where: { id: entity.id! },
      data,
      include: this.defaultIncludes(),
    });
    return AttendanceMapper.toDomain(record);
  }

  // async findByProjectAndDateRange(
  //   projectId: string,
  //   startDate: Date,
  //   endDate: Date,
  // ): Promise<AttendanceRecord[]> {
  //   const records = await this.prisma.attendance.findMany({
  //     where: {
  //       project_id: projectId,
  //       date: {
  //         gte: startDate,
  //         lte: endDate,
  //       },
  //     },
  //     include: {
  //       user: true,
  //     },
  //   });

  //   return AttendanceMapper.fromPrismaResults(
  //     records as unknown as AttendancePersistence[],
  //   );
  // }

  // async findById(id: string): Promise<AttendanceRecord | null> {
  //   const record = await this.prisma.attendance.findUnique({
  //     where: { id },
  //     include: {
  //       user: true,
  //     },
  //   });

  //   if (!record) {
  //     return null;
  //   }

  //   return AttendanceMapper.fromPrismaResult(
  //     record as unknown as AttendancePersistence,
  //   );
  // }

  // async findByUserProjectDate(
  //   userId: string,
  //   projectId: string,
  //   date: Date,
  // ): Promise<AttendanceRecord | null> {
  //   const startOfDay = new Date(date);
  //   startOfDay.setHours(0, 0, 0, 0);
  //   const endOfDay = new Date(date);
  //   endOfDay.setHours(23, 59, 59, 999);

  //   const record = await this.prisma.attendance.findFirst({
  //     where: {
  //       user_id: userId,
  //       project_id: projectId,
  //       date: {
  //         gte: startOfDay,
  //         lte: endOfDay,
  //       },
  //     },
  //   });

  //   if (!record) {
  //     return null;
  //   }

  //   return AttendanceMapper.fromPrismaResult(
  //     record as unknown as AttendancePersistence,
  //   );
  // }

  // async findByUserAndDateRange(
  //   userId: string,
  //   projectId: string,
  //   startDate: Date,
  //   endDate: Date,
  // ): Promise<AttendanceRecord[]> {
  //   const records = await this.prisma.attendance.findMany({
  //     where: {
  //       user_id: userId,
  //       project_id: projectId,
  //       date: {
  //         gte: startDate,
  //         lte: endDate,
  //       },
  //     },
  //     orderBy: {
  //       date: 'desc',
  //     },
  //     include: {
  //       user: true,
  //     },
  //   });

  //   return AttendanceMapper.fromPrismaResults(
  //     records as unknown as AttendancePersistence[],
  //   );
  // }

  // async create(data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
  //   const prismaData = AttendanceMapper.toPrismaCreateInput(data);
  //   const record = await this.prisma.attendance.create({
  //     data: prismaData as Prisma.AttendanceUncheckedCreateInput,
  //   });
  //   return AttendanceMapper.fromPrismaResult(
  //     record as unknown as AttendancePersistence,
  //   );
  // }

  // async update(
  //   id: string,
  //   data: Partial<AttendanceRecord>,
  // ): Promise<AttendanceRecord> {
  //   const prismaData = AttendanceMapper.toPrismaUpdateInput(data);
  //   const record = await this.prisma.attendance.update({
  //     where: { id },
  //     data: prismaData as Prisma.AttendanceUpdateInput,
  //   });
  //   return AttendanceMapper.fromPrismaResult(
  //     record as unknown as AttendancePersistence,
  //   );
  // }
}
