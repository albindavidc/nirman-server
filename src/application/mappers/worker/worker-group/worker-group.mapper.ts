import { WorkerGroupEntity } from '../../../../domain/entities/worker-group.entity';
import {
  WorkerGroupResponseDto,
  WorkerGroupWithMembersResponseDto,
} from '../../../dto/worker/worker-group/worker-group-response.dto';

export class WorkerGroupMapper {
  static toResponse(entity: WorkerGroupEntity): WorkerGroupResponseDto {
    const dto = new WorkerGroupResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.trade = entity.trade;
    dto.projectId = entity.projectId;
    dto.createdById = entity.createdById;
    dto.isActive = entity.isActive;
    dto.memberCount = entity.memberCount;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static toResponseWithMembers(
    entity: WorkerGroupEntity,
  ): WorkerGroupWithMembersResponseDto {
    const dto = new WorkerGroupWithMembersResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.trade = entity.trade;
    dto.projectId = entity.projectId;
    dto.createdById = entity.createdById;
    dto.isActive = entity.isActive;
    dto.memberCount = entity.memberCount;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.members = entity.members.map((member) => ({
      id: member.id,
      groupId: member.groupId,
      workerId: member.workerId,
      memberName: member.memberName,
      memberPhotoUrl: member.memberPhotoUrl,
      joinedAt: member.joinedAt,
      isActive: member.isActive,
    }));
    return dto;
  }
}
