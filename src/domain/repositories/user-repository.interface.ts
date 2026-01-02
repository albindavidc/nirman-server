import { User } from '../entities/user.entity';

export interface IUserRepository {
  // Query methods
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;

  // Mutation methods
  create(data: Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  updatePassword(email: string, passwordHash: string): Promise<void>;
  delete(id: string): Promise<void>;
}

/**
 * Injection token for the User repository.
 */
export const USER_REPOSITORY: unique symbol = Symbol('USER_REPOSITORY');
