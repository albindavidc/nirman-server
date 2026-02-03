import { CreateMaterialDto } from '../../dto/material/material.dto';

export class CreateMaterialCommand {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly dto: CreateMaterialDto,
  ) {}
}
