import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMaterialCommand } from '../../../commands/material/delete-material.command';
import { MaterialRepository } from '../../../../infrastructure/repositories/material.repository';
import { MaterialDto } from '../../../dto/material/material.dto';
import { MaterialMapper } from '../../../../infrastructure/mappers/material.mapper';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteMaterialCommand)
export class DeleteMaterialHandler implements ICommandHandler<DeleteMaterialCommand> {
  constructor(private readonly materialRepository: MaterialRepository) {}

  async execute(command: DeleteMaterialCommand): Promise<MaterialDto> {
    const { materialId } = command;

    // We fetch ensuring it exists, repo throws if not found usually, but we added a check.
    const material = await this.materialRepository.findById(materialId);
    if (!material) {
      throw new NotFoundException(`Material with ID ${materialId} not found`);
    }

    material.status = 'archived';

    const updatedMaterial = await this.materialRepository.update(material);

    return MaterialMapper.toDto(updatedMaterial);
  }
}
