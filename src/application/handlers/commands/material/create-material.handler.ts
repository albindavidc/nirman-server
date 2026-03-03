import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MaterialRepository } from '../../../../infrastructure/repositories/material.repository';
import { MaterialDto } from '../../../dto/material/material.dto';
import { CreateMaterialCommand } from '../../../commands/material/create-material.command';
import { Material } from '../../../../domain/entities/material.entity';
import { MaterialMapper } from '../../../mappers/material.mapper';

@CommandHandler(CreateMaterialCommand)
export class CreateMaterialHandler implements ICommandHandler<CreateMaterialCommand> {
  constructor(private readonly repository: MaterialRepository) {}

  async execute(command: CreateMaterialCommand): Promise<MaterialDto> {
    const { projectId, userId, dto } = command;

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
      'in_stock', // Default status
      userId,
      new Date(),
      new Date(),
    );

    material.changeStatus('out_of_stock');

    const created = await this.repository.create(material);
    return MaterialMapper.toDto(created);
  }
}
