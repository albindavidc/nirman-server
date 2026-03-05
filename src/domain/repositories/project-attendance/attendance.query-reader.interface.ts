import { AttendanceEntity } from '../../entities/attendance.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';
import {
  AttendanceFilter,
  PaginatedAttendance,
  AttendanceSummary,
} from './attendance-repository.interface';

export interface IAttendanceQueryReader {
  findTodayByUser(
    userId: string,
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<AttendanceEntity | null>;

  findByUserPaginated(
    userId: string,
    filters: AttendanceFilter,
    tx?: ITransactionContext,
  ): Promise<PaginatedAttendance>;

  getSummaryByUser(
    userId: string,
    projectId?: string,
    tx?: ITransactionContext,
  ): Promise<AttendanceSummary>;

  existsTodayForUser(
    userId: string,
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<boolean>;

  findByProjectAndDateRange(
    projectId: string,
    startDate: Date,
    endDate: Date,
    tx?: ITransactionContext,
  ): Promise<AttendanceEntity[]>;

  findByUserProjectAndDateRange(
    userId: string,
    projectId: string,
    startDate: Date,
    endDate: Date,
    tx?: ITransactionContext,
  ): Promise<AttendanceEntity[]>;
}
