import { Prisma } from '../../../../generated/client/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user-repository.interface';
import { BaseRepository } from '../../base.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  // Query methods
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, is_deleted: false },
      include: { vendor: true, professional: true },
    });
    return user ? UserMapper.persistenceToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, is_deleted: false },
      include: { vendor: true, professional: true },
    });
    return user ? UserMapper.persistenceToEntity(user) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { phone_number: phoneNumber, is_deleted: false },
      include: { vendor: true, professional: true },
    });
    return user ? UserMapper.persistenceToEntity(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { is_deleted: false },
      include: { vendor: true, professional: true },
    });
    return users.map((user) => UserMapper.persistenceToEntity(user));
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id, is_deleted: false },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.user.count({
      where: { is_deleted: false },
    });
  }

  // Mutation methods
  async create(data: Partial<User>): Promise<User> {
    const persistenceData = UserMapper.entityToPersistence(data);

    // Remove relation keys as we handle them through connect if needed
    const createData = { ...persistenceData };
    delete createData.vendor;
    delete createData.professional;

    const created = await this.prisma.user.create({
      data: createData as Prisma.UserCreateInput,
    });

    // Fetch full structure to return domain entity
    return (await this.findById(created.id))!;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const persistenceData = UserMapper.entityToPersistence(data);
    // Remove relation keys and id as we handle them through connect if needed
    const updateData = { ...persistenceData };
    delete updateData.vendor;
    delete updateData.professional;
    delete updateData.id; // id cannot be updated in Prisma

    // Explicitly handle undefined to avoid wiping data with nulls if mapper returns them
    // The mapper typically returns Partial<UserPersistence>
    // We need to ensure we only update fields that are defined.
    // Clean undefined fields:
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    await this.prisma.user.update({
      where: { id },
      data: updateData as Prisma.UserUpdateInput,
    });

    return (await this.findById(id))!;
  }

  async updatePassword(email: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password_hash: passwordHash },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  }
}
