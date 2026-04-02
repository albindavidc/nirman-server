import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { ProjectWorkerWithUser } from '../../domain/repositories/project/project-worker-repository.interface';
import { AttendanceMethod } from '../../domain/value-objects/attendance-method.vo';
import { AttendanceStatus } from '../../domain/value-objects/attendance.vo';
import { WorkHours } from '../../domain/value-objects/work-hours.vo';
import { AttendanceResponseDto } from '../dto/attendance/attendance-response.dto';
import { AttendanceResponseDto as ProjectAttendanceResponseDto } from '../dto/project/attendance-response.dto';

export interface AttendancePersistenceModel {
  id: string | null;
  userId: string;
  projectId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: string;
  location: string | null;
  workHours: number | null;
  method: string;
  supervisorNotes: string | null;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
}

export class AttendanceMapper {
  static toDomain(record: AttendancePersistenceModel): AttendanceEntity {
    return new AttendanceEntity({
      id: record.id,
      userId: record.userId,
      projectId: record.projectId,
      date: record.date,
      checkIn: record.checkIn,

      checkOut: record.checkOut ?? null,
      status: AttendanceStatus.fromString(record.status),
      location: record.location ?? null,
      workHours: record.workHours
        ? WorkHours.fromNumber(record.workHours)
        : null,

      method: AttendanceMethod.fromString(record.method),
      supervisorNotes: record.supervisorNotes ?? null,
      isVerified: record.isVerified,
      verifiedBy: record.verifiedBy ?? null,
      verifiedAt: record.verifiedAt ?? null,
    });
  }

  static toPersistence(entity: AttendanceEntity): AttendancePersistenceModel {
    return {
      id: entity.id,
      userId: entity.userId,
      projectId: entity.projectId,
      date: entity.date,
      checkIn: entity.checkIn ?? null,
      checkOut: entity.checkOut ?? null,

      status: entity.status.value,
      location: entity.location ?? null,
      workHours: entity.workHours?.value ?? null,
      method: entity.method.value,
      supervisorNotes: entity.supervisorNotes ?? null,
      isVerified: entity.isVerified,
      verifiedBy: entity.verifiedBy ?? null,
      verifiedAt: entity.verifiedAt ?? null,
    };
  }

  static toResponseDto(entity: AttendanceEntity): AttendanceResponseDto {
    const dto = new AttendanceResponseDto();

    dto.id = entity.id!;
    dto.userId = entity.userId;
    dto.projectId = entity.projectId;
    dto.date = entity.date;
    dto.checkIn = entity.checkIn ?? null;
    dto.checkOut = entity.checkOut ?? null;
    dto.status = entity.status.value;
    dto.location = entity.location ?? null;
    dto.workHours = entity.workHours?.value ?? null;
    dto.method = entity.method?.value ?? null;
    dto.supervisorNotes = entity.supervisorNotes ?? null;
    dto.isVerified = entity.isVerified;
    dto.verifiedBy = entity.verifiedBy ?? null;
    dto.verifiedAt = entity.verifiedAt ?? null;
    return dto;
  }

  static toProjectAttendanceDto(
    worker: ProjectWorkerWithUser,
    record: AttendanceEntity | undefined,
    searchDate: Date,
  ): ProjectAttendanceResponseDto {
    return {
      id: record?.id ?? `pending-${worker.userId}`,
      workerId: worker.userId,
      workerName: worker.user
        ? `${worker.user.firstName} ${worker.user.lastName}`
        : 'Unknown',
      workerRole: worker.role,
      date: searchDate.toISOString(),
      checkIn: record?.checkIn?.toISOString(),
      checkOut: record?.checkOut?.toISOString(),
      status: record?.status.value ?? 'absent',
      location: record?.location ?? undefined,
      workHours: record?.workHours ? record.workHours.value : undefined,
      method: record?.method?.value ?? 'MANUAL',
      supervisorNotes: record?.supervisorNotes,
      isVerified: record?.isVerified ?? false,
      verifiedBy: record?.verifiedBy,
      verifiedAt: record?.verifiedAt?.toISOString(),
    };
  }

  static toProjectAttendanceDtoList(
    workers: ProjectWorkerWithUser[],
    attendanceMap: Map<string, AttendanceEntity>,
    searchDate: Date,
  ): ProjectAttendanceResponseDto[] {
    return workers.map((worker) =>
      this.toProjectAttendanceDto(
        worker,
        attendanceMap.get(worker.userId),
        searchDate,
      ),
    );
  }

  // static fromPrismaResult(result: AttendancePersistence): AttendanceEntity {
  //   return {
  //     id: result.id,
  //     userId: result.userId,
  //     projectId: result.projectId,
  //     date: result.date,
  //     checkIn: result.checkIn,
  //     checkOut: result.checkOut,
  //     status: result.status,
  //     location: result.location,
  //     workHours: result.workHours,
  //     method: result.method,
  //     supervisorNotes: result.supervisorNotes,
  //     isVerified: result.isVerified,
  //     verifiedBy: result.verifiedBy,
  //     verifiedAt: result.verifiedAt,
  //   };
  // }
  // static fromPrismaResults(
  //   results: AttendancePersistence[],
  // ): AttendanceRecord[] {
  //   return results.map((r) => this.fromPrismaResult(r));
  // }
  // static toPrismaCreateInput(
  //   data: Partial<AttendanceRecord>,
  // ): AttendanceCreatePersistenceInput {
  //   // Note: data is from Domain, we map to Persistence Input.
  //   if (
  //     !data.userId ||
  //     !data.projectId ||
  //     !data.date ||
  //     !data.status ||
  //     !data.method
  //   ) {
  //     // Should validation be here or in domain? Assuming validated data.
  //     // But for type safety we cast or check.
  //   }
  //   return {
  //     userId: data.userId!,
  //     projectId: data.projectId!,
  //     date: data.date!,
  //     checkIn: data.checkIn ?? null,
  //     checkOut: data.checkOut ?? null,
  //     status: data.status!,
  //     location: data.location ?? null,
  //     workHours: data.workHours ?? null,
  //     method: data.method!,
  //   };
  // }
  // static toPrismaUpdateInput(
  //   data: Partial<AttendanceRecord>,
  // ): AttendanceUpdatePersistenceInput {
  //   const updateData: AttendanceUpdatePersistenceInput = {};
  //   if (data.checkIn !== undefined) updateData.checkIn = data.checkIn;
  //   if (data.checkOut !== undefined) updateData.checkOut = data.checkOut;
  //   if (data.status !== undefined) updateData.status = data.status;
  //   if (data.location !== undefined) updateData.location = data.location;
  //   if (data.workHours !== undefined) updateData.workHours = data.workHours;
  //   if (data.supervisorNotes !== undefined)
  //     updateData.supervisorNotes = data.supervisorNotes;
  //   if (data.isVerified !== undefined) updateData.isVerified = data.isVerified;
  //   if (data.verifiedBy !== undefined) updateData.verifiedBy = data.verifiedBy;
  //   if (data.verifiedAt !== undefined) updateData.verifiedAt = data.verifiedAt;
  //   return updateData;
  // }
}
