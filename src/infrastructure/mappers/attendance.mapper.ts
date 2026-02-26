import { AttendanceResponseDto } from '../../application/dto/attendance/attendance-response.dto';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { AttendanceMethod } from '../../domain/value-objects/attendance-method.vo';
import { AttendanceStatus } from '../../domain/value-objects/attendance.vo';
import { WorkHours } from '../../domain/value-objects/work-hours.vo';
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

    if (!entity.id) {
      throw new Error(
        'AttendanceEntity must have an id to be converted to AttendanceResponseDto',
      );
    }

    dto.id = entity.id;
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

  // static fromPrismaResult(result: AttendancePersistence): AttendanceEntity {
  //   return {
  //     id: result.id,
  //     userId: result.user_id,
  //     projectId: result.project_id,
  //     date: result.date,
  //     checkIn: result.check_in,
  //     checkOut: result.check_out,
  //     status: result.status,
  //     location: result.location,
  //     workHours: result.work_hours,
  //     method: result.method,
  //     supervisorNotes: result.supervisor_notes,
  //     isVerified: result.is_verified,
  //     verifiedBy: result.verified_by,
  //     verifiedAt: result.verified_at,
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
  //     user_id: data.userId!,
  //     project_id: data.projectId!,
  //     date: data.date!,
  //     check_in: data.checkIn ?? null,
  //     check_out: data.checkOut ?? null,
  //     status: data.status!,
  //     location: data.location ?? null,
  //     work_hours: data.workHours ?? null,
  //     method: data.method!,
  //   };
  // }
  // static toPrismaUpdateInput(
  //   data: Partial<AttendanceRecord>,
  // ): AttendanceUpdatePersistenceInput {
  //   const updateData: AttendanceUpdatePersistenceInput = {};
  //   if (data.checkIn !== undefined) updateData.check_in = data.checkIn;
  //   if (data.checkOut !== undefined) updateData.check_out = data.checkOut;
  //   if (data.status !== undefined) updateData.status = data.status;
  //   if (data.location !== undefined) updateData.location = data.location;
  //   if (data.workHours !== undefined) updateData.work_hours = data.workHours;
  //   if (data.supervisorNotes !== undefined)
  //     updateData.supervisor_notes = data.supervisorNotes;
  //   if (data.isVerified !== undefined) updateData.is_verified = data.isVerified;
  //   if (data.verifiedBy !== undefined) updateData.verified_by = data.verifiedBy;
  //   if (data.verifiedAt !== undefined) updateData.verified_at = data.verifiedAt;
  //   return updateData;
  // }
}
