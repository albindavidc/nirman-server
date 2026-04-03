export class WorkerGroupMemberResponseDto {
  id!: string;
  groupId!: string;
  workerId!: string;
  workerName!: string;
  workerPhotoUrl!: string | null;
  joinedAt!: Date;
  isActive!: boolean;
}

export class WorkerGroupResponseDto {
  id!: string;
  name!: string;
  description!: string;
  trade!: string;
  projectId!: string;
  createdById!: string;

  isActive!: boolean;
  workerCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class WorkerGroupWithMembersResponseDto extends WorkerGroupResponseDto {
  workers!: WorkerGroupMemberResponseDto[];
}
