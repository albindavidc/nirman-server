import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialTransaction } from '../../domain/entities/material-transaction.entity';
import { MaterialTransactionMapper } from '../../application/mappers/material-transaction.mapper';

@Injectable()
export class MaterialTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: MaterialTransaction): Promise<MaterialTransaction> {
    const data = MaterialTransactionMapper.toPersistence(transaction);
    const created = await this.prisma.materialTransaction.create({
      data,
    });
    return MaterialTransactionMapper.toDomain(created);
  }

  async findByProjectId(projectId: string): Promise<MaterialTransaction[]> {
    const transactions = await this.prisma.materialTransaction.findMany({
      where: { material: { project_id: projectId } },
      orderBy: { date: 'desc' },
      include: { material: true }, // Optional: include material details
    });
    return transactions.map((t) => MaterialTransactionMapper.toDomain(t));
  }

  async findByMaterialId(materialId: string): Promise<MaterialTransaction[]> {
    const transactions = await this.prisma.materialTransaction.findMany({
      where: { material_id: materialId },
      orderBy: { date: 'desc' },
    });
    return transactions.map((t) => MaterialTransactionMapper.toDomain(t));
  }
}
