import { UpdateMaterialDto } from '../../dto/material/material.dto';

export class UpdateMaterialCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly dto: UpdateMaterialDto,
  ) {}
}
