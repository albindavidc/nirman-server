import { Material } from '../../domain/entities/material.entity';
import {
  MaterialPersistence,
  MaterialCreatePersistenceInput,
  MaterialUpdatePersistenceInput,
} from '../types/material.types';

export class MaterialMapper {
  static fromPrismaResult(result: MaterialPersistence): Material {
    return new Material(
      result.id,
      result.project_id,
      result.material_name,
      result.material_code,
      result.category,
      result.description || undefined,
      result.specifications || undefined,
      result.current_stock,
      result.unit,
      result.unit_price || undefined,
      result.reorder_level || undefined,
      result.storage_location || undefined,
      result.preferred_supplier_id || undefined,
      result.status,
      result.created_by,
      result.created_at,
      result.updated_at,
    );
  }

  static fromPrismaResults(results: MaterialPersistence[]): Material[] {
    return results.map((r) => this.fromPrismaResult(r));
  }

  static toPrismaCreateInput(domain: Material): MaterialCreatePersistenceInput {
    // Note: Creating explicit object to match persistence
    return {
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
    };
  }

  static toPrismaUpdateInput(domain: Material): MaterialUpdatePersistenceInput {
    // Only map partial fields needed for update (or all if repository passes full entity)
    // The previous Repo implementation updated: current_stock, status, updated_at
    // But Mapper should support fuller update if provided?
    // Based on Repo usage:
    // repo.update calls toPersistence(material).
    // repo update extracts: current_stock, status.
    // If we want to be clean, Repo should construct specific Input, or Mapper provides standard inputs.
    // I will implement fuller update map.

    return {
      material_name: domain.name,
      category: domain.category,
      description: domain.description || null,
      specifications: domain.specifications || null,
      current_stock: domain.currentStock,
      // Assuming unit, code might be immutable?
      unit_price: domain.unitPrice || null,
      reorder_level: domain.reorderLevel || null,
      storage_location: domain.storageLocation || null,
      preferred_supplier_id: domain.preferredSupplierId || null,
      status: domain.status,
    };
  }
}
