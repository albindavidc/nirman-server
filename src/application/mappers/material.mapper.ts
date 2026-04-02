import {
  Material as PrismaMaterial,
  Prisma,
} from '../../generated/client/client';
import { Material } from '../../domain/entities/material.entity';
import { MaterialStatus } from '../../domain/enums/material-status.enum';
import { MaterialDto } from '../dto/material/material.dto';

/**
 * SRP — Pure data transformation only. Zero business logic.
 *
 * toDomain()              — PrismaMaterial → Material entity.
 * toUncheckedCreateInput() — Material entity → Prisma UncheckedCreateInput.
 *                            UncheckedCreateInput is the correct type here
 *                            because we pass scalar FKs (projectId, createdBy)
 *                            directly rather than relation connect objects.
 * toUncheckedUpdateInput() — Material entity → Prisma UncheckedUpdateInput.
 * toDto()                 — Material entity → MaterialDto (presentation layer).
 *
 * fromPrismaResult / fromPrismaResults / toPersistence / toPrismaCreateInput /
 * toPrismaUpdateInput are removed — they were duplicate paths that caused
 * divergence and hid the type cast `as unknown as MaterialPersistence`.
 */
export class MaterialMapper {
  static toDomain(raw: PrismaMaterial): Material {
    return new Material(
      raw.id,
      raw.projectId,
      raw.materialName,
      raw.materialCode,
      raw.category,
      raw.description ?? undefined,
      raw.specifications ?? undefined,
      raw.currentStock,
      raw.unit,
      raw.unitPrice ?? undefined,
      raw.reorderLevel ?? undefined,
      raw.storageLocation ?? undefined,
      raw.preferredSupplierId ?? undefined,
      (raw.status as MaterialStatus) ?? MaterialStatus.IN_STOCK,
      raw.createdBy,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toUncheckedCreateInput(
    domain: Material,
  ): Prisma.MaterialUncheckedCreateInput {
    return {
      projectId: domain.projectId,
      materialName: domain.name,
      materialCode: domain.code,
      category: domain.category,
      description: domain.description ?? null,
      specifications: domain.specifications ?? null,
      currentStock: domain.currentStock,
      unit: domain.unit,
      unitPrice: domain.unitPrice ?? null,
      reorderLevel: domain.reorderLevel ?? null,
      storageLocation: domain.storageLocation ?? null,
      preferredSupplierId: domain.preferredSupplierId ?? null,
      status: domain.status,
      createdBy: domain.createdBy,
    };
  }

  static toUncheckedUpdateInput(
    domain: Material,
  ): Prisma.MaterialUncheckedUpdateInput {
    return {
      materialName: domain.name,
      category: domain.category,
      description: domain.description ?? null,
      specifications: domain.specifications ?? null,
      currentStock: domain.currentStock,
      unit: domain.unit,
      unitPrice: domain.unitPrice ?? null,
      reorderLevel: domain.reorderLevel ?? null,
      storageLocation: domain.storageLocation ?? null,
      preferredSupplierId: domain.preferredSupplierId ?? null,
      status: domain.status,
    };
  }

  static toDto(domain: Material): MaterialDto {
    return {
      id: domain.id,
      projectId: domain.projectId,
      name: domain.name,
      code: domain.code,
      category: domain.category,
      description: domain.description,
      specifications: domain.specifications,
      currentStock: domain.currentStock,
      unit: domain.unit,
      unitPrice: domain.unitPrice,
      reorderLevel: domain.reorderLevel,
      storageLocation: domain.storageLocation,
      preferredSupplierId: domain.preferredSupplierId,
      status: domain.status,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
