import { Prisma } from 'src/generated/client/client';

export type VenderPersistence = Prisma.VendorGetPayload<{
  include: {
    user: true;
  };
}> & { id: string };
