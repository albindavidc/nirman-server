import { UpdateWorkerDto } from '../../dto/worker/update-worker.dto';

export class UpdateWorkerCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateWorkerDto,
  ) {}
}
