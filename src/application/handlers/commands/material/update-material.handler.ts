import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateMaterialCommand } from '../../../commands/material/update-material.command';
import { MaterialDto } from '../../../dto/material/material.dto';
import { MaterialStatus } from '../../../../domain/enums/material-status.enum';
import { MaterialMapper } from '../../../mappers/material.mapper';
import {
  IMaterialReader,
  MATERIAL_READER,
} from '../../../../domain/repositories/project-material/material.reader.interface';
import {
  IMaterialWriter,
  MATERIAL_WRITER,
} from '../../../../domain/repositories/project-material/material.writer.interface';

/**
 * DIP — injects IMaterialReader (for the guard-read) and IMaterialWriter
 * (for the save). Never the full repository.
 */
@CommandHandler(UpdateMaterialCommand)
export class UpdateMaterialHandler implements ICommandHandler<UpdateMaterialCommand> {
  constructor(
    @Inject(MATERIAL_READER)
    private readonly reader: IMaterialReader,
    @Inject(MATERIAL_WRITER)
    private readonly writer: IMaterialWriter,
  ) {}

  async execute(command: UpdateMaterialCommand): Promise<MaterialDto> {
    const material = await this.reader.findById(command.id);
    if (!material) {
      throw new NotFoundException('Material not found');
    }

    const { dto } = command;
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
    if (dto.status !== undefined)
      material.changeStatus(dto.status as MaterialStatus);

    const saved = await this.writer.save(material);
    return MaterialMapper.toDto(saved);
  }
}
