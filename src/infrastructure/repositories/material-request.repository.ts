import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialRequest } from '../../domain/entities/material-request.entity';
import { MaterialRequestMapper } from '../../application/mappers/material-request.mapper';

@Injectable()
export class MaterialRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: MaterialRequest): Promise<MaterialRequest> {
    const data = MaterialRequestMapper.toPersistence(request);
    const created = await this.prisma.materialRequest.create({
      data,
    });
    return MaterialRequestMapper.toDomain(created);
  }

  async findByProjectId(projectId: string): Promise<MaterialRequest[]> {
    const requests = await this.prisma.materialRequest.findMany({
      where: { project_id: projectId },
      orderBy: { created_at: 'desc' },
    });
    return requests.map((request) => MaterialRequestMapper.toDomain(request));
  }

  async findById(id: string): Promise<MaterialRequest | null> {
    const request = await this.prisma.materialRequest.findUnique({
      where: { id },
    });
    if (!request) return null;
    return MaterialRequestMapper.toDomain(request);
  }

  async update(request: MaterialRequest): Promise<MaterialRequest> {
    const data = MaterialRequestMapper.toPersistence(request);
    const updated = await this.prisma.materialRequest.update({
      where: { id: request.id },
      data,
    });
    return MaterialRequestMapper.toDomain(updated);
  }
}
