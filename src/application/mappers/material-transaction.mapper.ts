import { MaterialTransaction } from '../../domain/entities/material-transaction.entity';
import { MaterialTransactionDto } from '../dto/material/transaction.dto';
import {
  MaterialTransaction as PrismaMaterialTransaction,
  Prisma,
} from '../../generated/client/client';

export class MaterialTransactionMapper {
  static toDomain(persistence: PrismaMaterialTransaction): MaterialTransaction {
    return new MaterialTransaction(
      persistence.id,
      persistence.materialId,
      persistence.type,
      persistence.quantity,
      persistence.date,
      persistence.referenceId,
      persistence.performedBy,
      persistence.notes,
    );
  }

  static toDto(domain: MaterialTransaction): MaterialTransactionDto {
    return {
      id: domain.id,
      materialId: domain.materialId,
      type: domain.type,
      quantity: domain.quantity,
      date: domain.date,
      referenceId: domain.referenceId ?? undefined,
      performedBy: domain.performedBy ?? undefined,
      notes: domain.notes ?? undefined,
    };
  }

  static toPersistence(
    domain: MaterialTransaction,
  ): Prisma.MaterialTransactionUncheckedCreateInput {
    return {
      materialId: domain.materialId,
      type: domain.type,
      quantity: domain.quantity,
      date: domain.date,
      referenceId: domain.referenceId ?? null,
      performedBy: domain.performedBy ?? null,
      notes: domain.notes ?? null,
    };
  }
}
