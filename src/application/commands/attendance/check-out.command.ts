import { ICommand } from '@nestjs/cqrs';
import { CheckOutDto } from '../../dto/attendance/check-out.dto';

export class CheckOutCommand implements ICommand {
  constructor(public readonly dto: CheckOutDto) {}
}
