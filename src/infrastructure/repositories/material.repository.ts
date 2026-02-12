import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/client/client';
import { Material } from '../../domain/entities/material.entity';
import { MaterialMapper } from '../mappers/material.mapper';
import { MaterialPersistence } from '../types/material.types';

@Injectable()
export class MaterialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectId(projectId: string): Promise<Material[]> {
    const materials = await this.prisma.material.findMany({
      where: { project_id: projectId },
      orderBy: { created_at: 'desc' },
    });
    return MaterialMapper.fromPrismaResults(
      materials as unknown as MaterialPersistence[],
    );
  }

  async findById(id: string): Promise<Material | null> {
    const material = await this.prisma.material.findUnique({
      where: { id },
    });
    return material
      ? MaterialMapper.fromPrismaResult(
          material as unknown as MaterialPersistence,
        )
      : null;
  }

  async create(material: Material): Promise<Material> {
    const prismaData = MaterialMapper.toPrismaCreateInput(material);

    const created = await this.prisma.material.create({
      data: prismaData as Prisma.MaterialUncheckedCreateInput,
    });
    return MaterialMapper.fromPrismaResult(
      created as unknown as MaterialPersistence,
    );
  }

  async update(material: Material): Promise<Material> {
    const prismaData = MaterialMapper.toPrismaUpdateInput(material);
    const updated = await this.prisma.material.update({
      where: { id: material.id },
      data: {
        ...prismaData,
        updated_at: new Date(),
      },
    });
    return MaterialMapper.fromPrismaResult(
      updated as unknown as MaterialPersistence,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.material.update({
      where: { id },
      data: {
        status: 'archived',
        updated_at: new Date(),
      },
    });
  }
}
