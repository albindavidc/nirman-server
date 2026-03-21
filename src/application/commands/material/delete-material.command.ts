import { Command } from '@nestjs/cqrs';
import { MaterialDto } from '../../dto/material/material.dto';

export class DeleteMaterialCommand extends Command<MaterialDto> {
  constructor(
    public readonly materialId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
