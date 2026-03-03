import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/client/client';
import {
  IWorkerRepository,
  WorkerWithProfessional,
  CreateWorkerData,
  UpdateWorkerData,
} from '../../domain/repositories/worker-repository.interface';
import { WorkerWherePersistenceInput } from '../types/worker.types';
import { WorkerMapper } from '../../application/mappers/worker.mapper';
import { Role as UserRole } from '../../domain/enums/role.enum';

@Injectable()
export class WorkerRepository implements IWorkerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<WorkerWithProfessional | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { professional: true },
    });
    return user ? WorkerMapper.fromPrismaResult(user) : null;
  }

  async findByEmail(email: string): Promise<WorkerWithProfessional | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { professional: true },
    });
    return user ? WorkerMapper.fromPrismaResult(user) : null;
  }

  async findAllWithFilters(params: {
    page: number;
    limit: number;
    role?: string;
    search?: string;
  }): Promise<{ workers: WorkerWithProfessional[]; total: number }> {
    const { page, limit, role, search } = params;
    const skip = (page - 1) * limit;

    const where: WorkerWherePersistenceInput = {
      role: { in: [UserRole.WORKER, UserRole.SUPERVISOR] },
    };

    if (role) {
      where.role = role as UserRole;
    }

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const prismaWhere = WorkerMapper.toPrismaWhereInput(where);

    const [workers, total] = await Promise.all([
      this.prisma.user.findMany({
        where: prismaWhere as Prisma.UserWhereInput,
        skip,
        take: limit,
        include: { professional: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count({
        where: prismaWhere as Prisma.UserWhereInput,
      }),
    ]);

    return {
      workers: WorkerMapper.fromPrismaResults(workers),
      total,
    };
  }

  async create(data: CreateWorkerData): Promise<WorkerWithProfessional> {
    const prismaData = WorkerMapper.toPrismaCreateInput(data);

    const created = await this.prisma.user.create({
      data: prismaData as Prisma.UserCreateInput,
      include: { professional: true },
    });

    return WorkerMapper.fromPrismaResult(created);
  }

  async update(
    id: string,
    data: UpdateWorkerData,
  ): Promise<WorkerWithProfessional> {
    const prismaData = WorkerMapper.toPrismaUpdateInput(data);

    await this.prisma.user.update({
      where: { id },

      data: prismaData as Prisma.UserUpdateInput,
    });

    return (await this.findById(id))!;
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<WorkerWithProfessional> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { user_status: status },
      include: { professional: true },
    });

    return WorkerMapper.fromPrismaResult(user);
  }
}
