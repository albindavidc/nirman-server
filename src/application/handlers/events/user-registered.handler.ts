import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { UserRegisteredEvent } from '../../../domain/events/user-registered.event';
import {
  EMAIL_SERVICE,
  IEmailService,
} from '../../interfaces/email-service.interface';

/**
 * User Registered Event Handler
 *
 * Handles the UserRegisteredEvent by sending a welcome email to the new user.
 * Follows Clean Architecture by depending on the IEmailService interface.
 */
@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler implements IEventHandler<UserRegisteredEvent> {
  private readonly logger = new Logger(UserRegisteredHandler.name);

  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    this.logger.log(`Handling UserRegisteredEvent for user: ${event.userId}`);

    try {
      await this.emailService.sendWelcomeEmail(event.email, event.firstName);
      this.logger.log(`Welcome email sent successfully to ${event.email}`);
    } catch (error) {
      // Log error but don't fail the registration
      this.logger.error(
        `Failed to send welcome email to ${event.email}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
