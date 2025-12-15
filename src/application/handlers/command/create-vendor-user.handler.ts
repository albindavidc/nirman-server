//src/application/handlers/command/create-vendor-user.handler.ts

import { CreateVendorUserCommand } from 'src/application/command/create-vendor-user.command';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { BadRequestException } from '@nestjs/common';
import argon2 from 'argon2';
import { UserMapper } from 'src/application/mappers/user.mapper';

@CommandHandler(CreateVendorUserCommand)
export class CreateVendorUserHandler implements ICommandHandler<CreateVendorUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateVendorUserCommand): Promise<String> {
    const { dto } = command;
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashPassword = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
      hashLength: 32,
    });

    const userEntity = UserMapper.dtoToEntity({
      ...dto,
      password: hashPassword,
    });
    const userPersistence = UserMapper.entityToPersistence(userEntity);
    const saved = await this.userRepository.createUser(userPersistence);

    const fullEntity = UserMapper.persistenceToEntity(saved);

    const userModel = this.eventPublisher.mergeObjectContext(fullEntity);
    userModel.apply('User Registered');
    userModel.commit();

    return saved.id;
  }
}
