import {
  MaterialRequest,
  MaterialRequestItem,
} from '../../domain/entities/material-request.entity';
import { MaterialRequestDto } from '../dto/material/request.dto';
import {
  MaterialRequest as PrismaMaterialRequest,
  Prisma,
} from '../../generated/client/client';
import { MaterialRequestStatus } from '../../domain/enums/material-request-status.enum';
import { MaterialRequestPriority } from '../../domain/enums/material-request-priority.enum';

interface PersistedItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
}
export class MaterialRequestMapper {
  static toDomain(persistence: PrismaMaterialRequest): MaterialRequest {
    const items = (persistence.items as object[] as PersistedItem[]).map(
      (i) =>
        new MaterialRequestItem(
          i.materialId,
          i.materialName,
          i.quantity,
          i.unit,
        ),
    );

    return new MaterialRequest(
      persistence.id,
      persistence.requestNumber,
      persistence.projectId,
      persistence.requestedBy,
      items,
      persistence.priority as MaterialRequestPriority,
      persistence.purpose,
      persistence.deliveryLocation,
      persistence.requiredDate,
      persistence.status as MaterialRequestStatus,
      persistence.approvedBy,
      persistence.approvedAt,
      persistence.approvalComments,
      persistence.rejectionReason,
      persistence.createdAt,
      persistence.updatedAt,
    );
  }

  /** Domain entity → Prisma CreateInput (not UncheckedCreateInput) */
  static toCreateInput(
    domain: MaterialRequest,
  ): Prisma.MaterialRequestCreateInput {
    return {
      requestNumber: domain.requestNumber,
      items: domain.items.map((item) => ({
        materialId: item.materialId,
        materialName: item.materialName,
        quantity: item.quantity,
        unit: item.unit,
      })),
      priority: domain.priority,
      purpose: domain.purpose ?? null,
      deliveryLocation: domain.deliveryLocation ?? null,
      requiredDate: domain.requiredDate,
      status: domain.status,
      // approvedBy is the scalar FK — in CreateInput use the relation nested write
      ...(domain.approvedBy
        ? { approver: { connect: { id: domain.approvedBy } } }
        : {}),
      approvedAt: domain.approvedAt ?? null,
      approvalComments: domain.approvalComments ?? null,
      rejectionReason: domain.rejectionReason ?? null,
      project: { connect: { id: domain.projectId } },
      requester: { connect: { id: domain.requestedBy } },
    };
  }

  /** Domain entity → Prisma UpdateInput */
  static toUpdateInput(
    domain: MaterialRequest,
  ): Prisma.MaterialRequestUpdateInput {
    return {
      requestNumber: domain.requestNumber,
      items: domain.items.map((item) => ({
        materialId: item.materialId,
        materialName: item.materialName,
        quantity: item.quantity,
        unit: item.unit,
      })),
      priority: domain.priority,
      purpose: domain.purpose ?? null,
      deliveryLocation: domain.deliveryLocation ?? null,
      requiredDate: domain.requiredDate,
      status: domain.status,
      // Do NOT set approvedBy scalar — use only the relation nested write
      approvedAt: domain.approvedAt ?? null,
      approvalComments: domain.approvalComments ?? null,
      rejectionReason: domain.rejectionReason ?? null,
      ...(domain.approvedBy
        ? { approver: { connect: { id: domain.approvedBy } } }
        : { approver: { disconnect: true } }),
    };
  }

  /** Domain entity → DTO for application responses */
  static toDto(domain: MaterialRequest): MaterialRequestDto {
    return {
      id: domain.id,
      requestNumber: domain.requestNumber,
      projectId: domain.projectId,
      requestedBy: domain.requestedBy,
      items: domain.items.map((i) => ({
        materialId: i.materialId,
        materialName: i.materialName,
        quantity: i.quantity,
        unit: i.unit,
      })),
      priority: domain.priority,
      purpose: domain.purpose ?? undefined,
      deliveryLocation: domain.deliveryLocation ?? undefined,
      requiredDate: domain.requiredDate,
      status: domain.status,
      approvedBy: domain.approvedBy ?? undefined,
      approvedAt: domain.approvedAt ?? undefined,
      approvalComments: domain.approvalComments ?? undefined,
      rejectionReason: domain.rejectionReason ?? undefined,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
