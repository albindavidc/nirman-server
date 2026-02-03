import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MaterialRepository } from '../../../../infrastructure/persistence/repositories/material/material.repository';
import { MaterialDto } from '../../../dto/material/material.dto';
import { CreateMaterialCommand } from '../../../commands/material/create-material.command';
import { Material } from '../../../../domain/entities/material.entity';
import { MaterialMapper } from '../../../mappers/material.mapper';

@CommandHandler(CreateMaterialCommand)
export class CreateMaterialHandler implements ICommandHandler<CreateMaterialCommand> {
  constructor(private readonly repository: MaterialRepository) {}

  async execute(command: CreateMaterialCommand): Promise<MaterialDto> {
    const { projectId, userId, dto } = command;

    // Create domain entity
    const material = new Material(
      '', // ID handled by DB
      projectId,
      dto.name,
      dto.code,
      dto.category,
      dto.description,
      dto.specifications,
      0, // Initial stock 0
      dto.unit,
      dto.unitPrice,
      dto.reorderLevel,
      dto.storageLocation,
      dto.preferredSupplierId,
      'in_stock', // Default status, though logic says 0 might be out_of_stock. Let's rely on updateStatus or set initial.
      userId,
      new Date(),
      new Date(),
    );

    // Correct status based on stock 0
    // material.updateStatus(); // Helper method I created, but it's private. I should expose `updateStatus` or run logic here.
    // Actually I made it private in my previous step. I'll just set it manually here.
    material.status = 'out_of_stock';

    const created = await this.repository.create(material);
    return MaterialMapper.toDto(created);
  }
}
