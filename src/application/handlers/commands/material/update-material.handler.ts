import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMaterialCommand } from '../../../commands/material/update-material.command';
import { MaterialRepository } from '../../../../infrastructure/repositories/material.repository';
import { MaterialDto } from '../../../dto/material/material.dto';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateMaterialCommand)
export class UpdateMaterialHandler implements ICommandHandler<UpdateMaterialCommand> {
  constructor(private readonly repository: MaterialRepository) {}

  async execute(command: UpdateMaterialCommand): Promise<MaterialDto> {
    const material = await this.repository.findById(command.id);
    if (!material) {
      throw new NotFoundException('Material not found');
    }

    // Update fields
    const { dto } = command;
    if (dto.name !== undefined) material.name = dto.name;
    if (dto.category !== undefined) material.category = dto.category;
    if (dto.unit !== undefined) material.unit = dto.unit;
    if (dto.description !== undefined) material.description = dto.description;
    if (dto.specifications !== undefined)
      material.specifications = dto.specifications;
    if (dto.reorderLevel !== undefined)
      material.reorderLevel = dto.reorderLevel;
    if (dto.unitPrice !== undefined) material.unitPrice = dto.unitPrice;
    if (dto.storageLocation !== undefined)
      material.storageLocation = dto.storageLocation;
    if (dto.preferredSupplierId !== undefined)
      material.preferredSupplierId = dto.preferredSupplierId;
    if (dto.status !== undefined) material.status = dto.status;

    const updatedMaterial = await this.repository.update(material);

    return {
      id: updatedMaterial.id,
      projectId: updatedMaterial.projectId,
      name: updatedMaterial.name,
      code: updatedMaterial.code,
      category: updatedMaterial.category,
      description: updatedMaterial.description,
      specifications: updatedMaterial.specifications,
      currentStock: updatedMaterial.currentStock,
      unit: updatedMaterial.unit,
      unitPrice: updatedMaterial.unitPrice,
      reorderLevel: updatedMaterial.reorderLevel,
      storageLocation: updatedMaterial.storageLocation,
      preferredSupplierId: updatedMaterial.preferredSupplierId,
      status: updatedMaterial.status,
      createdAt: updatedMaterial.createdAt,
      updatedAt: updatedMaterial.updatedAt,
    };
  }
}
