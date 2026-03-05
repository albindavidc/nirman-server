import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateMaterialCommand } from '../../../commands/material/create-material.command';
import { MaterialDto } from '../../../dto/material/material.dto';
import { Material } from '../../../../domain/entities/material.entity';
import { MaterialStatus } from '../../../../domain/enums/material-status.enum';
import { MaterialMapper } from '../../../mappers/material.mapper';
import {
  IMaterialWriter,
  MATERIAL_WRITER,
} from '../../../../domain/repositories/project-material/material.writer.interface';

/**
 * DIP — injects only IMaterialWriter via Symbol token.
 * No direct reference to any infrastructure class.
 */
@CommandHandler(CreateMaterialCommand)
export class CreateMaterialHandler implements ICommandHandler<CreateMaterialCommand> {
  constructor(
    @Inject(MATERIAL_WRITER)
    private readonly writer: IMaterialWriter,
  ) {}

  async execute(command: CreateMaterialCommand): Promise<MaterialDto> {
    const { projectId, userId, dto } = command;

    const material = new Material(
      '',
      projectId,
      dto.name,
      dto.code,
      dto.category,
      dto.description,
      dto.specifications,
      0,
      dto.unit,
      dto.unitPrice,
      dto.reorderLevel,
      dto.storageLocation,
      dto.preferredSupplierId,
      MaterialStatus.OUT_OF_STOCK,
      userId,
      new Date(),
      new Date(),
    );

    const created = await this.writer.save(material);
    return MaterialMapper.toDto(created);
  }
}
