import { Prisma } from 'src/generated/client/client';

export type VendorPersistence = Prisma.VendorGetPayload<{
  include: {
    user: true;
  };
}> & { id: string };
