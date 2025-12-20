import { Prisma } from 'src/generated/client/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPersistence } from './user.persistence';
import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/modules/user/domain/repositories/user-repository.interface';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';

@Injectable()
export class UserRepository
  extends BaseRepository<UserPersistence>
  implements IUserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  // Query methods
  async findById(id: string): Promise<UserPersistence | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { vendor: true, professional: true },
    });
  }

  async findByEmail(email: string): Promise<UserPersistence | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { vendor: true, professional: true },
    });
  }

  async findByPhoneNumber(
    phoneNumber: string,
  ): Promise<UserPersistence | null> {
    return this.prisma.user.findUnique({
      where: { phone_number: phoneNumber },
      include: { vendor: true, professional: true },
    });
  }

  async findAll(): Promise<UserPersistence[]> {
    return this.prisma.user.findMany({
      include: { vendor: true, professional: true },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { id } });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  // Mutation methods
  async create(data: Partial<UserPersistence>): Promise<UserPersistence> {
    const excludeKeys = ['id', 'vendor'];
    const createData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !excludeKeys.includes(key)),
    ) as unknown as Prisma.UserCreateInput;

    const created = await this.prisma.user.create({
      data: createData,
    });

    return { ...created, vendor: null, professional: null } as UserPersistence;
  }

  async update(
    id: string,
    data: Partial<UserPersistence>,
  ): Promise<UserPersistence> {
    const excludeKeys = ['id', 'vendor', 'professional'];
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !excludeKeys.includes(key)),
    ) as Prisma.UserUpdateInput;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { vendor: true, professional: true },
    });
  }

  async updatePassword(email: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password_hash: passwordHash },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
