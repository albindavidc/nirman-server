import { Prisma } from 'src/generated/client/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPersistence } from './user.persistence';
import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/modules/user/domain/repositories/IUserRepository';
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
      include: { vendor: true },
    });
  }

  async findByPhoneNumber(
    phoneNumber: string,
  ): Promise<UserPersistence | null> {
    return this.prisma.user.findUnique({
      where: { phone_number: phoneNumber },
      include: { vendor: true },
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
    const { id, vendor, professional, ...createData } = data as any;

    const created = await this.prisma.user.create({
      data: createData,
    });

    return { ...created, vendor: null, professional: null } as UserPersistence;
  }

  async update(
    id: string,
    data: Partial<UserPersistence>,
  ): Promise<UserPersistence> {
    const { vendor, professional, ...updateData } = data as any;
    delete updateData.id;

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
