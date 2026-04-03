import { Injectable } from '@nestjs/common';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { CreateWorkerData, IWorkerRepository, UpdateWorkerData, WorkerWithProfessional } from '../../../domain/repositories/worker-repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { RepositoryUtils } from '../repository.utils';
import { Prisma, PrismaClient } from '../../../generated/client';
import { WorkerMapper } from '../../../application/mappers/worker/worker.mapper';
import { WorkerWherePersistenceInput } from '../../types/worker.types';
import { Role as UserRole } from '../../../domain/enums/role.enum';
import { UserStatus } from '../../../domain/enums/user-status.enum';


@Injectable()
export class WorkerRepository implements IWorkerRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Queries ───────────────────────────────────────────────────────────────

  async findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional | null> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const user = await client.user.findUnique({
        where: { id },
        include: { professional: true },
      });

      if (!user) return null;

      return user ? WorkerMapper.fromPrismaResult(user) : null;
    } catch (error: unknown) {
      return RepositoryUtils.handleError(error);
    }
  }

  async findByEmail(
    email: string,
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional | null> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const user = await client.user.findUnique({
        where: { email },
        include: { professional: true },
      });
      return user ? WorkerMapper.fromPrismaResult(user) : null;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findAllWithFilters(
    params: {
      page: number;
      limit: number;
      role?: UserRole; // ✅ typed enum, not raw string
      search?: string;
    },
    tx?: ITransactionContext,
  ): Promise<{ workers: WorkerWithProfessional[]; total: number }> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    const { page, limit, role, search } = params;
    const skip = (page - 1) * limit;

    const where: WorkerWherePersistenceInput = {
      role: { in: [UserRole.WORKER, UserRole.SUPERVISOR] },
    };

    if (role) {
      where.role = role; // ✅ already UserRole — no cast needed
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // ✅ Mapper returns Prisma.UserWhereInput directly — no double cast needed
    const prismaWhere: Prisma.UserWhereInput =
      WorkerMapper.toPrismaWhereInput(where);

    try {
      const [users, total] = await Promise.all([
        client.user.findMany({
          where: prismaWhere, // ✅ clean, no cast
          skip,
          take: limit,
          include: { professional: true },
          orderBy: { createdAt: 'desc' },
        }),
        client.user.count({
          where: prismaWhere, // ✅ clean, no cast
        }),
      ]);

      return {
        workers: WorkerMapper.fromPrismaResults(users),
        total,
      };
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  async create(
    data: CreateWorkerData,
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;

    // ✅ Mapper must return Prisma.UserCreateInput — fix belongs in the mapper
    const prismaData: Prisma.UserCreateInput =
      WorkerMapper.toPrismaCreateInput(data);

    try {
      const created = await client.user.create({
        data: prismaData, // ✅ no double cast
        include: { professional: true },
      });
      return WorkerMapper.fromPrismaResult(created);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async update(
    id: string,
    data: UpdateWorkerData,
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;

    // ✅ Mapper must return Prisma.UserUpdateInput — fix belongs in the mapper
    const prismaData: Prisma.UserUpdateInput =
      WorkerMapper.toPrismaUpdateInput(data);

    try {
      const updated = await client.user.update({
        where: { id },
        data: prismaData, // ✅ no double cast
        include: { professional: true }, // ✅ single query — no second round-trip
      });
      return WorkerMapper.fromPrismaResult(updated);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async updateStatus(
    id: string,
    status: UserStatus, // ✅ typed enum, not raw string
    tx?: ITransactionContext,
  ): Promise<WorkerWithProfessional> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const user = await client.user.update({
        where: { id },
        data: { userStatus: status },
        include: { professional: true },
      });
      return WorkerMapper.fromPrismaResult(user);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
