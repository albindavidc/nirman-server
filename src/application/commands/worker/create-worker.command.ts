import { Command } from '@nestjs/cqrs';
import { WorkerResponseDto } from '../../dto/worker/worker-response.dto';
import { CreateWorkerDto } from '../../dto/worker/create-worker.dto';

export class CreateWorkerCommand extends Command<WorkerResponseDto> {
  constructor(public readonly data: CreateWorkerDto) {
    super();
  }
}
