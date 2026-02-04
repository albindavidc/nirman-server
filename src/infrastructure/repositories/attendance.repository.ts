import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import {
  IAttendanceRepository,
  AttendanceRecord,
} from '../../domain/repositories/attendance-repository.interface';

import { PrismaAttendance } from '../types/attendance.types';

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

    return records.map((record) =>
      this.mapToDomain(record as PrismaAttendance),
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

    return this.mapToDomain(record as PrismaAttendance);
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

    return this.mapToDomain(record as PrismaAttendance);
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

    return records.map((record) =>
      this.mapToDomain(record as PrismaAttendance),
    );
  }

  async create(data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const record = await this.prisma.attendance.create({
      data: {
        user_id: data.userId!,
        project_id: data.projectId!,
        date: data.date!,
        check_in: data.checkIn,
        check_out: data.checkOut,
        status: data.status!,
        location: data.location,
        method: data.method,
        work_hours: data.workHours,
      },
    });
    return this.mapToDomain(record);
  }

  async update(
    id: string,
    data: Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord> {
    const record = await this.prisma.attendance.update({
      where: { id },
      data: {
        check_in: data.checkIn,
        check_out: data.checkOut,
        status: data.status,
        location: data.location,
        work_hours: data.workHours,
        supervisor_notes: data.supervisorNotes,
        is_verified: data.isVerified,
        verified_by: data.verifiedBy,
        verified_at: data.verifiedAt,
      },
    });
    return this.mapToDomain(record);
  }

  private mapToDomain(record: PrismaAttendance): AttendanceRecord {
    return {
      id: record.id,
      userId: record.user_id,
      projectId: record.project_id,
      date: record.date,
      checkIn: record.check_in,
      checkOut: record.check_out,
      status: record.status,
      location: record.location,
      workHours: record.work_hours,
      method: record.method,
      supervisorNotes: record.supervisor_notes,
      isVerified: record.is_verified,
      verifiedBy: record.verified_by,
      verifiedAt: record.verified_at,
    };
  }
}
