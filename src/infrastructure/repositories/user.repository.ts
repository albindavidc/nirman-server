import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from '../../application/mappers/user.mapper';
import { UserCacheService } from '../redis/user-cache.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userCache: UserCacheService,
  ) {}

  async findById(id: string): Promise<User | null> {
    // Check Redis profile cache first
    const cached = await this.userCache.getProfile<any>(id);
    if (cached) return UserMapper.fromPersistenceResult(cached);

    const user = await this.prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: { vendor: true, professional: true },
    });

    if (!user) return null;

    // Populate cache for subsequent requests (30 min TTL)
    await this.userCache.setProfile(id, user);

    return UserMapper.fromPersistenceResult(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
      include: { vendor: true, professional: true },
    });
    return user ? UserMapper.fromPersistenceResult(user) : null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { phoneNumber: phoneNumber, isDeleted: false },
      include: { vendor: true, professional: true },
    });
    return user ? UserMapper.fromPersistenceResult(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { isDeleted: false },
      include: { vendor: true, professional: true },
    });
    return UserMapper.fromPersistenceResults(users);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id, isDeleted: false },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.user.count({
      where: { isDeleted: false },
    });
  }

  async create(data: User): Promise<User> {
    const prismaData = UserMapper.toPersistenceCreateInput(data);
    delete prismaData.vendor;
    delete prismaData.professional;

    const created = await this.prisma.user.create({
      data: prismaData as unknown as Parameters<
        PrismaService['user']['create']
      >[0]['data'],
    });

    return (await this.findById(created.id))!;
  }

  async update(id: string, data: User): Promise<User> {
    const prismaData = UserMapper.toPersistenceUpdateInput(data);

    delete prismaData.vendor;
    delete prismaData.professional;
    delete prismaData.id;

    const cleanData = Object.fromEntries(
      Object.entries(prismaData).filter((entry) => entry[1] !== undefined),
    );

    await this.prisma.user.update({
      where: { id },
      data: cleanData as unknown as Parameters<
        PrismaService['user']['update']
      >[0]['data'],
    });

    // Invalidate stale profile cache before re-fetching
    await this.userCache.invalidateProfile(id);
    return (await this.findById(id))!;
  }

  async updatePassword(email: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { passwordHash: passwordHash },
    });
  }

  async delete(id: string): Promise<void> {
    await this.userCache.invalidateProfile(id);
    await this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
