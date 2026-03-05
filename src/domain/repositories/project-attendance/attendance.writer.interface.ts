import { AttendanceEntity } from '../../entities/attendance.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export interface IAttendanceWriter {
  save(
    entity: AttendanceEntity,
    tx?: ITransactionContext,
  ): Promise<AttendanceEntity>;
  softDelete(id: string, tx?: ITransactionContext): Promise<void>;
}
