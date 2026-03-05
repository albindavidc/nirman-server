import { Prisma } from '../../generated/client/client';
import { ITransactionContext } from '../../domain/interfaces/transaction-context.interface';
import { PrismaTransactionContext } from '../prisma/prisma-transaction.context';
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
    return tx ? (tx as PrismaTransactionContext).client : prisma;
  }

  static handleError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new NotFoundException('Entity not found');
        case 'P2002':
          throw new ConflictException('Duplicate entity');
        case 'P2003':
          throw new BadRequestException('Foreign key constraint failed');
        default:
          throw new InternalServerErrorException(
            `Database error: ${error.message}`,
          );
      }
    }
    throw error as Error;
  }
}
