import { Material } from '../../entities/material.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const MATERIAL_READER = Symbol('MATERIAL_READER');

/**
 * ISP — Reader interface: minimal point-reads needed by guards and validators.
 */
export interface IMaterialReader {
  findById(id: string, tx?: ITransactionContext): Promise<Material | null>;
  existsById(id: string, tx?: ITransactionContext): Promise<boolean>;
}
