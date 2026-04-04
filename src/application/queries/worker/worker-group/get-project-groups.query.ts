import { TradeType } from '../../../../domain/enums/trade-type.enum';

export class GetProjectGroupQuery {
  constructor(
    public readonly trade?: TradeType,
    public readonly isActive?: boolean,
    public readonly search?: string,
  ) {}
}
