import { CreateMaterialRequestDto } from '../../dto/material/request.dto';

export class CreateMaterialRequestCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: CreateMaterialRequestDto,
  ) {}
}
