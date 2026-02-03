import {
  MaterialRequest,
  MaterialRequestItem,
} from '../../domain/entities/material-request.entity';
import { MaterialRequestDto } from '../dto/material/request.dto';
import {
  MaterialRequest as PrismaMaterialRequest,
  Prisma,
} from '../../generated/client/client';

interface PersistenceItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
}

export class MaterialRequestMapper {
  static toDomain(persistence: PrismaMaterialRequest): MaterialRequest {
    const items = persistence.items as unknown as PersistenceItem[];

    return new MaterialRequest(
      persistence.id,
      persistence.request_number,
      persistence.project_id,
      persistence.requested_by,
      items.map(
        (i) =>
          new MaterialRequestItem(
            i.materialId,
            i.materialName,
            i.quantity,
            i.unit,
          ),
      ),
      persistence.priority,
      persistence.purpose,
      persistence.delivery_location,
      persistence.required_date,
      persistence.status,
      persistence.approved_by,
      persistence.approved_at,
      persistence.approval_comments,
      persistence.rejection_reason,
      persistence.created_at,
      persistence.updated_at,
    );
  }

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

  static toPersistence(
    domain: MaterialRequest,
  ): Prisma.MaterialRequestUncheckedCreateInput {
    return {
      // id auto-generated
      project_id: domain.projectId,
      request_number: domain.requestNumber,
      requested_by: domain.requestedBy,
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
      approved_by: domain.approvedBy ?? null,
      approved_at: domain.approvedAt ?? null,
      approval_comments: domain.approvalComments ?? null,
      rejection_reason: domain.rejectionReason ?? null,
      // converted_to_po default false
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}
