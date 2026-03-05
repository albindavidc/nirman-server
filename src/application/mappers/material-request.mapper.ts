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
      persistence.request_number,
      persistence.project_id,
      persistence.requested_by,
      items,
      persistence.priority as MaterialRequestPriority,
      persistence.purpose,
      persistence.delivery_location,
      persistence.required_date,
      persistence.status as MaterialRequestStatus,
      persistence.approved_by,
      persistence.approved_at,
      persistence.approval_comments,
      persistence.rejection_reason,
      persistence.created_at,
      persistence.updated_at,
    );
  }

  /** Domain entity → Prisma CreateInput (not UncheckedCreateInput) */
  static toCreateInput(
    domain: MaterialRequest,
  ): Prisma.MaterialRequestCreateInput {
    return {
      request_number: domain.requestNumber,
      items: domain.items.map((item) => ({
        materialId: item.materialId,
        materialName: item.materialName,
        quantity: item.quantity,
        unit: item.unit,
      })),
      priority: domain.priority,
      purpose: domain.purpose ?? null,
      delivery_location: domain.deliveryLocation ?? null,
      required_date: domain.requiredDate,
      status: domain.status,
      // approved_by is the scalar FK — in CreateInput use the relation nested write
      ...(domain.approvedBy
        ? { approver: { connect: { id: domain.approvedBy } } }
        : {}),
      approved_at: domain.approvedAt ?? null,
      approval_comments: domain.approvalComments ?? null,
      rejection_reason: domain.rejectionReason ?? null,
      project: { connect: { id: domain.projectId } },
      requester: { connect: { id: domain.requestedBy } },
    };
  }

  /** Domain entity → Prisma UpdateInput */
  static toUpdateInput(
    domain: MaterialRequest,
  ): Prisma.MaterialRequestUpdateInput {
    return {
      request_number: domain.requestNumber,
      items: domain.items.map((item) => ({
        materialId: item.materialId,
        materialName: item.materialName,
        quantity: item.quantity,
        unit: item.unit,
      })),
      priority: domain.priority,
      purpose: domain.purpose ?? null,
      delivery_location: domain.deliveryLocation ?? null,
      required_date: domain.requiredDate,
      status: domain.status,
      // Do NOT set approved_by scalar — use only the relation nested write
      approved_at: domain.approvedAt ?? null,
      approval_comments: domain.approvalComments ?? null,
      rejection_reason: domain.rejectionReason ?? null,
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
