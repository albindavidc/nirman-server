import { Command } from '@nestjs/cqrs';
import { MaterialDto } from '../../dto/material/material.dto';
import { UpdateMaterialDto } from '../../dto/material/material.dto';

export class UpdateMaterialCommand extends Command<MaterialDto> {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly dto: UpdateMaterialDto,
  ) {
    super();
  }
}
