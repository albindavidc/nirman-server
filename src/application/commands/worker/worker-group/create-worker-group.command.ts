import { TradeType } from '../../../../domain/enums/trade-type.enum';

export class CreateWorkerGroupCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly trade: TradeType,
    public readonly createdById: string,
    public readonly workerIds: string[] = [],
  ) {}
}
