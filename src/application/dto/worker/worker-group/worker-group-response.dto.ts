export class WorkerGroupMemberResponseDto {
  id!: string;
  groupId!: string;
  workerId!: string;
  userId!: string; // The User ID for linking
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
  createdById!: string;

  isActive!: boolean;
  workerCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class WorkerGroupWithMembersResponseDto extends WorkerGroupResponseDto {
  workers!: WorkerGroupMemberResponseDto[];
}
