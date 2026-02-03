import { MaterialModel as PrismaMaterial } from '../../generated/client/models';
import { Material } from '../../domain/entities/material.entity';
import { MaterialDto } from '../dto/material/material.dto';

export class MaterialMapper {
  static toDomain(raw: PrismaMaterial): Material {
    return new Material(
      raw.id,
      raw.project_id,
      raw.material_name,
      raw.material_code,
      raw.category,
      raw.description || undefined,
      raw.specifications || undefined,
      raw.current_stock,
      raw.unit,
      raw.unit_price || undefined,
      raw.reorder_level || undefined,
      raw.storage_location || undefined,
      raw.preferred_supplier_id || undefined,
      raw.status,
      raw.created_by,
      raw.created_at,
      raw.updated_at,
    );
  }

  static toPersistence(domain: Material): PrismaMaterial {
    return {
      id: domain.id,
      project_id: domain.projectId,
      material_name: domain.name,
      material_code: domain.code,
      category: domain.category,
      description: domain.description || null,
      specifications: domain.specifications || null,
      current_stock: domain.currentStock,
      unit: domain.unit,
      unit_price: domain.unitPrice || null,
      reorder_level: domain.reorderLevel || null,
      storage_location: domain.storageLocation || null,
      preferred_supplier_id: domain.preferredSupplierId || null,
      status: domain.status,
      created_by: domain.createdBy,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
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
