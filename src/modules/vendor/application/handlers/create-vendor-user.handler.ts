//src/application/handlers/command/create-vendor-user.handler.ts

import { CreateVendorUserCommand } from 'src/modules/vendor/application/commands/create-vendor-user.command';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/repositories/user-repository.interface';
import { BadRequestException, ConflictException, Inject } from '@nestjs/common';
import argon2 from 'argon2';
import { UserMapper } from 'src/modules/user/infrastructure/persistence/user.mapper';
import { Prisma } from 'src/generated/client/client';

@CommandHandler(CreateVendorUserCommand)
export class CreateVendorUserHandler implements ICommandHandler<CreateVendorUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateVendorUserCommand): Promise<string> {
    const { dto } = command;
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check for existing email
    const existingUser = await this.userRepository.findByEmail(dto.email);
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
      const userEntity = UserMapper.dtoToEntity({
        ...dto,
        password: hashPassword,
      });
      const userPersistence = UserMapper.entityToPersistence(userEntity);
      const saved = await this.userRepository.create(userPersistence);

      const fullEntity = UserMapper.persistenceToEntity(saved);

      const userModel = this.eventPublisher.mergeObjectContext(fullEntity);
      userModel.apply('User Registered');
      userModel.commit();

      return saved.id;
    } catch (error) {
      // Handle Prisma unique constraint errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error.meta?.target as string) || '';
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
