import { ICommand } from '@nestjs/cqrs';
import { CheckInDto } from '../../dto/attendance/check-in.dto';

export class CheckInCommand implements ICommand {
  constructor(public readonly dto: CheckInDto) {}
}
