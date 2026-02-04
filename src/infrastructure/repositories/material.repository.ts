import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Material } from '../../domain/entities/material.entity';
import { MaterialMapper } from '../../application/mappers/material.mapper';

@Injectable()
export class MaterialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectId(projectId: string): Promise<Material[]> {
    const materials = await this.prisma.material.findMany({
      where: { project_id: projectId },
      orderBy: { created_at: 'desc' },
    });
    return materials.map((m) => MaterialMapper.toDomain(m));
  }

  async findById(id: string): Promise<Material | null> {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });
    return material ? MaterialMapper.toDomain(material) : null;
  }

  async create(material: Material): Promise<Material> {
    const data = MaterialMapper.toPersistence(material);
    const { id, ...createData } = data;
    void id;
    const created = await this.prisma.material.create({
      data: createData,
    });
    return MaterialMapper.toDomain(created);
  }

  async update(material: Material): Promise<Material> {
    const data = MaterialMapper.toPersistence(material);
    const updated = await this.prisma.material.update({
      where: { id: material.id },
      data: {
        current_stock: data.current_stock,
        status: data.status,
        updated_at: new Date(),
      },
    });
    return MaterialMapper.toDomain(updated);
  }
}
