import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MaterialRequestRepository } from '../../../../infrastructure/persistence/repositories/material/material-request.repository';
import { MaterialRequestDto } from '../../../dto/material/request.dto';
import {
  MaterialRequest,
  MaterialRequestItem,
} from '../../../../domain/entities/material-request.entity';
import { MaterialRequestMapper } from '../../../mappers/material-request.mapper';

import { CreateMaterialRequestCommand } from '../../../commands/material/create-material-request.command';

@CommandHandler(CreateMaterialRequestCommand)
export class CreateMaterialRequestHandler implements ICommandHandler<CreateMaterialRequestCommand> {
  constructor(private readonly repository: MaterialRequestRepository) {}

  async execute(
    command: CreateMaterialRequestCommand,
  ): Promise<MaterialRequestDto> {
    const { userId, dto } = command;

    const request = new MaterialRequest(
      '',
      `REQ-${Date.now()}`,
      dto.projectId,
      userId,
      dto.items.map(
        (i) =>
          new MaterialRequestItem(
            i.materialId,
            i.materialName,
            i.quantity,
            i.unit,
          ),
      ),
      dto.priority || 'medium',
      dto.purpose || null,
      dto.deliveryLocation || null,
      dto.requiredDate,
      'pending',
      null,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    const created = await this.repository.create(request);
    return MaterialRequestMapper.toDto(created);
  }
}
