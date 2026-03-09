import { BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import * as argon2 from 'argon2';
import { UserRegisteredEvent } from '../../../../domain/events/user-registered.event';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { Prisma } from '../../../../generated/client/client';
import { CreateUserCommand } from '../../../commands/user/create-user.command';
import { UserMapper } from '../../../mappers/user.mapper';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { dto, role } = command;
    // Normalize email to lowercase
    const email = dto.email.toLowerCase();

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check for existing email
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // Check for existing phone number
    const existingPhone = await this.userRepository.findByPhoneNumber(
      dto.phoneNumber,
    );
    if (existingPhone) {
      throw new ConflictException(
        'A user with this phone number already exists',
      );
    }

    const hashPassword = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
      hashLength: 32,
    });

    try {
      const userEntity = UserMapper.dtoToEntity(
        {
          ...dto,
          email, // Use lowercased email
          password: hashPassword,
        },
        role,
      );

      // Repository now accepts Domain Entity directly
      const saved = await this.userRepository.create(userEntity);

      const userModel = this.eventPublisher.mergeObjectContext(saved);
      userModel.apply(new UserRegisteredEvent(saved.id, email, dto.firstName));
      userModel.commit();

      return saved.id;
    } catch (error: unknown) {
      // Handle Prisma unique constraint errors from Repository (if it propagates them)
      const err = error as any;
      if (error instanceof Prisma.PrismaClientKnownRequestError || err.code) {
        if (err.code === 'P2002') {
          const target = (err.meta?.target as string | undefined) || '';
          if (target.includes('email')) {
            throw new ConflictException(
              'A user with this email already exists',
            );
          } else if (target.includes('phone_number')) {
            throw new ConflictException(
              'A user with this phone number already exists',
            );
          }
          throw new ConflictException(
            'A user with these details already exists',
          );
        }
      }
      throw error;
    }
  }
}
