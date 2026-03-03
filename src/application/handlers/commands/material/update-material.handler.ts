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

    // Update fields using entity methods
    const { dto } = command;

    // Pass existing values if dto properties are undefined
    material.updateDetails(
      dto.name ?? material.name,
      dto.category ?? material.category,
      dto.description !== undefined ? dto.description : material.description,
      dto.specifications !== undefined
        ? dto.specifications
        : material.specifications,
      dto.unitPrice !== undefined ? dto.unitPrice : material.unitPrice,
      dto.reorderLevel !== undefined ? dto.reorderLevel : material.reorderLevel,
      dto.storageLocation !== undefined
        ? dto.storageLocation
        : material.storageLocation,
      dto.preferredSupplierId !== undefined
        ? dto.preferredSupplierId
        : material.preferredSupplierId,
    );

    if (dto.unit !== undefined) material.changeUnit(dto.unit);
    if (dto.status !== undefined) material.changeStatus(dto.status);

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
