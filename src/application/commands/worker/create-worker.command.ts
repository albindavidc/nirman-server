import { CreateWorkerDto } from '../../dto/worker/create-worker.dto';

export class CreateWorkerCommand {
  constructor(public readonly data: CreateWorkerDto) {}
}
