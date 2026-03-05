import { MaterialRequest } from '../../entities/material-request.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const MATERIAL_REQUEST_WRITER = Symbol('MATERIAL_REQUEST_WRITER');

/**
 * ISP — Writer interface: only mutation operations needed by command handlers.
 */
export interface IMaterialRequestWriter {
  save(
    entity: MaterialRequest,
    tx?: ITransactionContext,
  ): Promise<MaterialRequest>;
  softDelete(id: string, tx?: ITransactionContext): Promise<void>;
}
