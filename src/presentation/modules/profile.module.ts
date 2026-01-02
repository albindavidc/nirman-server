import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { UserRepository } from '../../infrastructure/persistence/repositories/user/user.repository';

// Domain interfaces
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';

// Controllers
import { ProfileController } from '../controllers/profile.controller';

// Query Handlers
import { GetProfileHandler } from '../../application/handlers/queries/profile/get-profile.handler';

// Command Handlers
import { UpdateProfileHandler } from '../../application/handlers/commands/profile/update-profile.handler';
import { UpdatePasswordHandler } from '../../application/handlers/commands/profile/update-password.handler';

const QueryHandlers = [GetProfileHandler];
const CommandHandlers = [UpdateProfileHandler, UpdatePasswordHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ProfileController],
  providers: [
    ...QueryHandlers,
    ...CommandHandlers,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
})
export class ProfileModule {}
