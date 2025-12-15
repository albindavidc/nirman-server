import { Prisma } from 'src/generated/client/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPersistence } from '../persistence/user.persistence';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Partial<UserPersistence>): Promise<UserPersistence> {
    return this.prisma.user.create({
      data: data as any,
      include: {
        vendor: true,
      },
    });
  }

  async findById(id: string): Promise<UserPersistence | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { vendor: true },
    });
  }

  async findByEmail(email: string): Promise<UserPersistence | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { vendor: true },
    });
  }

  async findAll(): Promise<UserPersistence[]> {
    return this.prisma.user.findMany({
      include: { vendor: true },
    });
  }

  async updateUser(data: Partial<UserPersistence>): Promise<UserPersistence> {
    return this.prisma.user.update({
      where: { id: data.id },
      data: data as any,
      include: { vendor: true },
    });
  }
}
