import { Material } from '../../entities/material.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const MATERIAL_WRITER = Symbol('MATERIAL_WRITER');

/**
 * ISP — Writer interface: only mutation operations needed by command handlers.
 */
export interface IMaterialWriter {
  save(entity: Material, tx?: ITransactionContext): Promise<Material>;
  softDelete(id: string, tx?: ITransactionContext): Promise<void>;
}
