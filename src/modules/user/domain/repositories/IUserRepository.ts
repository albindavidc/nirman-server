import { UserPersistence } from 'src/modules/user/infrastructure/persistence/user.persistence';

export interface IUserRepository {
  // Query methods
  findById(id: string): Promise<UserPersistence | null>;
  findByEmail(email: string): Promise<UserPersistence | null>;
  findByPhoneNumber(phoneNumber: string): Promise<UserPersistence | null>;
  findAll(): Promise<UserPersistence[]>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;

  // Mutation methods
  create(data: Partial<UserPersistence>): Promise<UserPersistence>;
  update(id: string, data: Partial<UserPersistence>): Promise<UserPersistence>;
  updatePassword(email: string, passwordHash: string): Promise<void>;
  delete(id: string): Promise<void>;
}

/**
 * Injection token for the User repository.
 */
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
