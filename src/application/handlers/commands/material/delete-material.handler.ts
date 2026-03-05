import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteMaterialCommand } from '../../../commands/material/delete-material.command';
import { MaterialDto } from '../../../dto/material/material.dto';
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
 * DIP — injects only the narrow interfaces it needs:
 *       IMaterialReader (guard-read) and IMaterialWriter (softDelete).
 */
@CommandHandler(DeleteMaterialCommand)
export class DeleteMaterialHandler implements ICommandHandler<DeleteMaterialCommand> {
  constructor(
    @Inject(MATERIAL_READER)
    private readonly reader: IMaterialReader,
    @Inject(MATERIAL_WRITER)
    private readonly writer: IMaterialWriter,
  ) {}

  async execute(command: DeleteMaterialCommand): Promise<MaterialDto> {
    const { materialId } = command;

    const material = await this.reader.findById(materialId);
    if (!material) {
      throw new NotFoundException(`Material with ID ${materialId} not found`);
    }

    material.markAsArchived();
    const saved = await this.writer.save(material);
    return MaterialMapper.toDto(saved);
  }
}
