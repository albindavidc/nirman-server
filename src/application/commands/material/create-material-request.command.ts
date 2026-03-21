import { Command } from '@nestjs/cqrs';
import { MaterialRequestDto } from '../../dto/material/request.dto';
import { CreateMaterialRequestDto } from '../../dto/material/request.dto';

export class CreateMaterialRequestCommand extends Command<MaterialRequestDto> {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateMaterialRequestDto,
  ) {
    super();
  }
}
