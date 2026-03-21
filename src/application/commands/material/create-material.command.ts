import { Command } from '@nestjs/cqrs';
import { MaterialDto } from '../../dto/material/material.dto';
import { CreateMaterialDto } from '../../dto/material/material.dto';

export class CreateMaterialCommand extends Command<MaterialDto> {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly dto: CreateMaterialDto,
  ) {
    super();
  }
}
