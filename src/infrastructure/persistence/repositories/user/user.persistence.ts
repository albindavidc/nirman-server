import { Prisma } from 'src/generated/client/client';

export type UserPersistence = Prisma.UserGetPayload<{
  include: {
    vendor: true;
    professional: true;
  };
}> & { id: string };
