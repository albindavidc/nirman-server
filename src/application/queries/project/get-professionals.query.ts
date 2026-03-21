import { Query } from '@nestjs/cqrs';
import { ProfessionalWithUser } from '../../../domain/repositories/professional-repository.interface';

export class GetProfessionalsQuery extends Query<ProfessionalWithUser[]> {
  constructor(
    public readonly search?: string,
    public readonly excludeProjectId?: string,
  ) {
    super();
  }
}
