import {
  WorkerGroupEntity,
  WorkerGroupMember,
  WorkerGroupProps,
} from '../../../../domain/entities/worker-group.entity';
import { TradeType } from '../../../../domain/enums/trade-type.enum';
import {
  WorkerGroupResponseDto,
  WorkerGroupWithMembersResponseDto,
} from '../../../dto/worker/worker-group/worker-group-response.dto';

export class WorkerGroupMapper {
  static toDomain(record: WorkerGroupProps): WorkerGroupEntity {
    const workers = record.workers.map((m) =>
      WorkerGroupMapper.toMemberProps(m),
    );
    return new WorkerGroupEntity({
      id: record.id,
      name: record.name,
      description: record.description,
      trade: record.trade as TradeType,
      projectId: record.projectId,
      createdById: record.createdById,
      isActive: record.isActive,
      workerCount: record.workerCount,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      isDeleted: record.isDeleted,
      deletedAt: record.deletedAt,
      workers,
    });
  }

  static toPersistence(entity: WorkerGroupEntity): WorkerGroupProps {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      trade: entity.trade as TradeType,
      projectId: entity.projectId,
      createdById: entity.createdById,
      isActive: entity.isActive,
      workerCount: entity.workerCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
      workers: entity.workers,
    };
  }

  static toResponse(entity: WorkerGroupProps): WorkerGroupResponseDto {
    const dto = new WorkerGroupResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.trade = entity.trade as TradeType;
    dto.projectId = entity.projectId;
    dto.createdById = entity.createdById;
    dto.isActive = entity.isActive;
    dto.workerCount = entity.workerCount;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static toResponseWithMembers(
    entity: WorkerGroupProps,
  ): WorkerGroupWithMembersResponseDto {
    const dto = new WorkerGroupWithMembersResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.trade = entity.trade as TradeType;
    dto.projectId = entity.projectId;
    dto.createdById = entity.createdById;
    dto.isActive = entity.isActive;
    dto.workerCount = entity.workerCount;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.workers = entity.workers.map((member) => ({
      id: member.id,
      groupId: member.groupId,
      workerId: member.workerId,
      workerName: member.workerName,
      workerPhotoUrl: member.workerPhotoUrl,
      joinedAt: member.createdAt,
      isActive: member.isActive,
    }));
    return dto;
  }

  /**
   * Helper methods
   */

  private static toMemberProps(raw: WorkerGroupMember): WorkerGroupMember {
    return {
      id: raw.id,
      groupId: raw.groupId,
      workerId: raw.workerId,
      workerName: raw.workerName,
      workerPhotoUrl: raw.workerPhotoUrl,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      isDeleted: raw.isDeleted,
      deletedAt: raw.deletedAt,
    };
  }
}
