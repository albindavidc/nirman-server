/**
 * User Registered Event
 *
 * Domain event published when a new user account is created.
 * Used to trigger side effects like sending welcome emails.
 */
export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly firstName: string,
  ) {}
}
