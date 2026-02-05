import { AttendanceRecord } from '../../domain/repositories/attendance-repository.interface';
import {
  AttendancePersistence,
  AttendanceCreatePersistenceInput,
  AttendanceUpdatePersistenceInput,
} from '../types/attendance.types';

export class AttendanceMapper {
  static fromPrismaResult(result: AttendancePersistence): AttendanceRecord {
    return {
      id: result.id,
      userId: result.user_id,
      projectId: result.project_id,
      date: result.date,
      checkIn: result.check_in,
      checkOut: result.check_out,
      status: result.status,
      location: result.location,
      workHours: result.work_hours,
      method: result.method,
      supervisorNotes: result.supervisor_notes,
      isVerified: result.is_verified,
      verifiedBy: result.verified_by,
      verifiedAt: result.verified_at,
    };
  }

  static fromPrismaResults(
    results: AttendancePersistence[],
  ): AttendanceRecord[] {
    return results.map((r) => this.fromPrismaResult(r));
  }

  static toPrismaCreateInput(
    data: Partial<AttendanceRecord>,
  ): AttendanceCreatePersistenceInput {
    // Note: data is from Domain, we map to Persistence Input.
    if (
      !data.userId ||
      !data.projectId ||
      !data.date ||
      !data.status ||
      !data.method
    ) {
      // Should validation be here or in domain? Assuming validated data.
      // But for type safety we cast or check.
    }

    return {
      user_id: data.userId!,
      project_id: data.projectId!,
      date: data.date!,
      check_in: data.checkIn ?? null,
      check_out: data.checkOut ?? null,
      status: data.status!,
      location: data.location ?? null,
      work_hours: data.workHours ?? null,
      method: data.method!,
    };
  }

  static toPrismaUpdateInput(
    data: Partial<AttendanceRecord>,
  ): AttendanceUpdatePersistenceInput {
    const updateData: AttendanceUpdatePersistenceInput = {};

    if (data.checkIn !== undefined) updateData.check_in = data.checkIn;
    if (data.checkOut !== undefined) updateData.check_out = data.checkOut;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.workHours !== undefined) updateData.work_hours = data.workHours;
    if (data.supervisorNotes !== undefined)
      updateData.supervisor_notes = data.supervisorNotes;
    if (data.isVerified !== undefined) updateData.is_verified = data.isVerified;
    if (data.verifiedBy !== undefined) updateData.verified_by = data.verifiedBy;
    if (data.verifiedAt !== undefined) updateData.verified_at = data.verifiedAt;

    return updateData;
  }
}
