import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileController } from 'src/presentation/controllers/profile.controller';
import { GetProfileHandler } from 'src/application/handlers/query/get-profile.handler';
import { UpdateProfileHandler } from 'src/application/handlers/command/update-profile.handler';
import { UpdatePasswordHandler } from 'src/application/handlers/command/update-password.handler';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from 'src/domain/repositories';
import { PrismaModule } from 'src/prisma/prisma.module';

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
