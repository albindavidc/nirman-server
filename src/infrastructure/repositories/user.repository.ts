import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { BaseRepository } from './base.repository';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, is_deleted: false },
      include: { vendor: true, professional: true },
    });
    return user ? UserMapper.fromPrismaResult(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, is_deleted: false },
      include: { vendor: true, professional: true },
    });
    return user ? UserMapper.fromPrismaResult(user) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { phone_number: phoneNumber, is_deleted: false },
      include: { vendor: true, professional: true },
    });
    return user ? UserMapper.fromPrismaResult(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { is_deleted: false },
      include: { vendor: true, professional: true },
    });
    return UserMapper.fromPrismaResults(users);
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

  async create(data: Partial<User>): Promise<User> {
    const persistenceData = UserMapper.entityToPersistence(data);

    // Remove relation keys as we handle them through connect if needed
    const createDataRaw = { ...persistenceData };
    delete createDataRaw.vendor;
    delete createDataRaw.professional;

    const prismaData = UserMapper.toPrismaCreateInput({ ...data });
    delete prismaData.vendor;
    delete prismaData.professional;

    const created = await this.prisma.user.create({
      data: prismaData as unknown as Parameters<
        PrismaService['user']['create']
      >[0]['data'],
    });

    return (await this.findById(created.id))!;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const prismaData = UserMapper.toPrismaUpdateInput(data);

    delete prismaData.vendor;

    delete prismaData.professional;

    delete prismaData.id;

    // Clean undefined fields

    Object.keys(prismaData).forEach(
      (key) => prismaData[key] === undefined && delete prismaData[key],
    );

    await this.prisma.user.update({
      where: { id },

      data: prismaData as unknown as Parameters<
        PrismaService['user']['update']
      >[0]['data'],
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
