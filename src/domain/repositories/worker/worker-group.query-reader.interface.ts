import { WorkerGroupProps } from '../../entities/worker-group.entity';

export type GetProjectGroupFilter = {
  trade?: string;
  isActive?: boolean;
  search?: string;
};

export interface IWorkerGroupQueryReader {
  findAllByProject(filter: GetProjectGroupFilter): Promise<WorkerGroupProps[]>;
  findByIdWithMembers(id: string): Promise<WorkerGroupProps | null>;
  countByProject(filter: GetProjectGroupFilter): Promise<number>;
}
