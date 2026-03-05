import { MaterialRequest } from '../../entities/material-request.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';
import { MaterialRequestStatus } from '../../enums/material-request-status.enum';

export const MATERIAL_REQUEST_QUERY_READER = Symbol(
  'MATERIAL_REQUEST_QUERY_READER',
);

export interface MaterialRequestFilter {
  projectId?: string;
  status?: MaterialRequestStatus;
  requestedBy?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface PaginatedMaterialRequests {
  data: MaterialRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * ISP — Query-reader interface: complex reads for query handlers only.
 * No write operations — ever.
 */
export interface IMaterialRequestQueryReader {
  findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<MaterialRequest[]>;

  findPaginated(
    filters: MaterialRequestFilter,
    tx?: ITransactionContext,
  ): Promise<PaginatedMaterialRequests>;

  findByDateRange(
    projectId: string,
    startDate: Date,
    endDate: Date,
    tx?: ITransactionContext,
  ): Promise<MaterialRequest[]>;
}
