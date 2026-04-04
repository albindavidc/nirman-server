import { TradeType } from '../../../../domain/enums/trade-type.enum';

export class UpdateWorkerGroupCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly trade?: TradeType,
    public readonly isActive?: boolean,
  ) {}
}
