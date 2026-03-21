import { Command } from '@nestjs/cqrs';
import { WorkerResponseDto } from '../../dto/worker/worker-response.dto';

export class BlockWorkerCommand extends Command<WorkerResponseDto> {
  constructor(public readonly id: string) {
    super();
  }
}

export class UnblockWorkerCommand extends Command<WorkerResponseDto> {
  constructor(public readonly id: string) {
    super();
  }
}
