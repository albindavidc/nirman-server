export class WorkerGroupMemberResponseDto {
  id!: string;
  groupId!: string;
  workerId!: string;
  memberName!: string;
  memberPhotoUrl!: string | null;
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
  memberCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class WorkerGroupWithMembersResponseDto extends WorkerGroupResponseDto {
  members!: WorkerGroupMemberResponseDto[];
}
