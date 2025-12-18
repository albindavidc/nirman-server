import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Professional } from 'src/generated/client/client';
import { IProfessionalRepository } from 'src/domain/repositories';

@Injectable()
export class ProfessionalRepository implements IProfessionalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    return this.prisma.professional.create({
      data,
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.professional.findUnique({
      where: { user_id: userId },
    });
  }

  async update(userId: string, data: Prisma.ProfessionalUncheckedUpdateInput) {
    return this.prisma.professional.update({
      where: { user_id: userId },
      data,
    });
  }
}
