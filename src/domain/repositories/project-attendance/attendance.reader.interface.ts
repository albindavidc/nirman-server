import { AttendanceEntity } from '../../entities/attendance.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export interface IAttendanceReader {
  findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<AttendanceEntity | null>;
  existsById(id: string, tx?: ITransactionContext): Promise<boolean>;
}
