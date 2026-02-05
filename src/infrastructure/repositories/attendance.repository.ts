import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { Prisma } from '../../generated/client/client';
import {
  IAttendanceRepository,
  AttendanceRecord,
} from '../../domain/repositories/attendance-repository.interface';
import { AttendanceMapper } from '../mappers/attendance.mapper';
import { AttendancePersistence } from '../types/attendance.types';

@Injectable()
export class AttendanceRepository implements IAttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectAndDateRange(
    projectId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AttendanceRecord[]> {
    const records = await this.prisma.attendance.findMany({
      where: {
        project_id: projectId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
      },
    });

    return AttendanceMapper.fromPrismaResults(
      records as unknown as AttendancePersistence[],
    );
  }

  async findById(id: string): Promise<AttendanceRecord | null> {
    const record = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!record) {
      return null;
    }

    return AttendanceMapper.fromPrismaResult(
      record as unknown as AttendancePersistence,
    );
  }

  async findByUserProjectDate(
    userId: string,
    projectId: string,
    date: Date,
  ): Promise<AttendanceRecord | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const record = await this.prisma.attendance.findFirst({
      where: {
        user_id: userId,
        project_id: projectId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (!record) {
      return null;
    }

    return AttendanceMapper.fromPrismaResult(
      record as unknown as AttendancePersistence,
    );
  }

  async findByUserAndDateRange(
    userId: string,
    projectId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AttendanceRecord[]> {
    const records = await this.prisma.attendance.findMany({
      where: {
        user_id: userId,
        project_id: projectId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        user: true,
      },
    });

    return AttendanceMapper.fromPrismaResults(
      records as unknown as AttendancePersistence[],
    );
  }

  async create(data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const prismaData = AttendanceMapper.toPrismaCreateInput(data);
    const record = await this.prisma.attendance.create({
      data: prismaData as Prisma.AttendanceUncheckedCreateInput,
    });
    return AttendanceMapper.fromPrismaResult(
      record as unknown as AttendancePersistence,
    );
  }

  async update(
    id: string,
    data: Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord> {
    const prismaData = AttendanceMapper.toPrismaUpdateInput(data);
    const record = await this.prisma.attendance.update({
      where: { id },
      data: prismaData as Prisma.AttendanceUpdateInput,
    });
    return AttendanceMapper.fromPrismaResult(
      record as unknown as AttendancePersistence,
    );
  }
}
