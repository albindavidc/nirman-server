import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileController } from 'src/modules/profile/presentation/profile.controller';
import { GetProfileHandler } from 'src/modules/profile/application/handlers/get-profile.handler';
import { UpdateProfileHandler } from 'src/modules/profile/application/handlers/update-profile.handler';
import { UpdatePasswordHandler } from 'src/modules/profile/application/handlers/update-password.handler';
import { UserRepository } from 'src/modules/user/infrastructure/persistence/user.repository';
import { USER_REPOSITORY } from 'src/modules/user/domain/repositories/user-repository.interface';
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
