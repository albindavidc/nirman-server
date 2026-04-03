import { Prisma } from '../../generated/client/client';
import { ITransactionContext } from '../../domain/interfaces/transaction-context.interface';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export class RepositoryUtils {
  static resolveClient(
    prisma: PrismaService,
    tx?: ITransactionContext,
  ): PrismaService | Prisma.TransactionClient {
    return tx ? tx.tx : prisma;
  }

  static handleError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const knownError = error as Prisma.PrismaClientKnownRequestError;
      switch (knownError.code) {
        case 'P2025':
          throw new NotFoundException('Entity not found');
        case 'P2002':
          throw new ConflictException('Duplicate entity');
        case 'P2003':
          throw new BadRequestException('Foreign key constraint failed');
        default:
          throw new InternalServerErrorException(
            `Database error: ${knownError.message}`,
          );
      }
    }
    throw error;
  }
}
