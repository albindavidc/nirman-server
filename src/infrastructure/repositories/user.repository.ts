import { Prisma } from 'src/generated/client/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPersistence } from '../persistence/user.persistence';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Partial<UserPersistence>): Promise<UserPersistence> {
    // Remove id and vendor from data for creation - Prisma will auto-generate id
    // and vendor will be created in step 2
    const { id, vendor, ...createData } = data as any;

    const created = await this.prisma.user.create({
      data: createData,
    });

    // Return with vendor as null for now (will be created in step 2)
    return { ...created, vendor: null } as UserPersistence;
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
