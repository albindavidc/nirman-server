import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Professional } from 'src/generated/client/client';
import { IProfessionalRepository } from 'src/modules/member/domain/repositories/professional-repository.interface';
import { BaseRepository } from 'src/shared/infrastructure/persistence/base.repository';

@Injectable()
export class ProfessionalRepository
  extends BaseRepository<
    Professional,
    Prisma.ProfessionalUncheckedCreateInput,
    Prisma.ProfessionalUncheckedUpdateInput
  >
  implements IProfessionalRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  // Query methods
  async findById(id: string): Promise<Professional | null> {
    return this.prisma.professional.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Professional | null> {
    return this.prisma.professional.findUnique({
      where: { user_id: userId },
    });
  }

  async findAll(): Promise<Professional[]> {
    return this.prisma.professional.findMany();
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.professional.count({ where: { id } });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.professional.count();
  }

  // Mutation methods
  async create(
    data: Prisma.ProfessionalUncheckedCreateInput,
  ): Promise<Professional> {
    return this.prisma.professional.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<Professional> {
    return this.prisma.professional.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.professional.delete({ where: { id } });
  }
}
