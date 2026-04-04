import { TradeType } from '../../domain/enums/trade-type.enum';

export interface WorkerGroupPersistence {
  id: string;
  name: string;
  description: string | null;
  trade: TradeType;
  createdById: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export interface WorkerGroupMemberPersistence {
  id: string;
  workerGroupId: string;
  workerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export type WorkerGroupWithCountPersistence = WorkerGroupPersistence & {
  workerCount: number;
};

export type WorkerGroupMemberWithWorkerPersistence =
  WorkerGroupMemberPersistence & {
    workerName: string;
    workerPhotoUrl: string | null;
  };

export type WorkerGroupWithWorkersPersistence = WorkerGroupPersistence & {
  workers: WorkerGroupMemberWithWorkerPersistence[];
};

export type WorkerGroupWithMembersRaw = WorkerGroupPersistence & {
  workers: (WorkerGroupMemberPersistence & {
    worker: {
      user: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhotoUrl: string | null;
      };
    };
  })[];
  _count?: {
    workers: number;
  };
};

export type WorkerGroupCreatePersistenceInput = Omit<
  WorkerGroupPersistence,
  'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt' | 'isActive'
>;

export type WorkerGroupUpdatePersistenceInput = Partial<
  Omit<
    WorkerGroupPersistence,
    'id' | 'createdAt' | 'updatedAt' | 'createdById'
  >
>;
