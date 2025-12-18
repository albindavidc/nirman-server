import { UserPersistence } from 'src/infrastructure/persistence/user.persistence';

/**
 * Interface for User repository operations.
 * Defines the contract for user data access that implementations must fulfill.
 */
export interface IUserRepository {
  /**
   * Creates a new user in the database.
   */
  createUser(data: Partial<UserPersistence>): Promise<UserPersistence>;

  /**
   * Finds a user by their unique ID.
   */
  findById(id: string): Promise<UserPersistence | null>;

  /**
   * Finds a user by their email address.
   */
  findByEmail(email: string): Promise<UserPersistence | null>;

  /**
   * Finds a user by their phone number.
   */
  findByPhoneNumber(phoneNumber: string): Promise<UserPersistence | null>;

  /**
   * Retrieves all users from the database.
   */
  findAll(): Promise<UserPersistence[]>;

  /**
   * Updates an existing user's data.
   */
  updateUser(data: Partial<UserPersistence>): Promise<UserPersistence>;

  /**
   * Updates a user's password by email.
   */
  updatePassword(email: string, passwordHash: string): Promise<void>;
}

/**
 * Injection token for the User repository.
 */
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
