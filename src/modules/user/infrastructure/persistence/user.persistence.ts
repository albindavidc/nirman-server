import type { UserGetPayload } from 'src/generated/client/models/User';

export type UserPersistence = UserGetPayload<{
  include: {
    vendor: true;
  };
}> & { id: string };
