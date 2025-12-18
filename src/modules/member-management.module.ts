import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MemberController } from 'src/presentation/controllers/member.controller';
import { GetMembersHandler } from 'src/application/handlers/query/get-members.handler';
import { AddMemberHandler } from 'src/application/handlers/command/add-member.handler';
import { EditMemberHandler } from 'src/application/handlers/command/edit-member.handler';
import { BlockMemberHandler } from 'src/application/handlers/command/block-member.handler';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { ProfessionalRepository } from 'src/infrastructure/repositories/professional.repository';
import {
  USER_REPOSITORY,
  PROFESSIONAL_REPOSITORY,
} from 'src/domain/repositories';

const QueryHandlers = [GetMembersHandler];
const CommandHandlers = [
  AddMemberHandler,
  EditMemberHandler,
  BlockMemberHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [MemberController],
  providers: [
    ...QueryHandlers,
    ...CommandHandlers,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: PROFESSIONAL_REPOSITORY, useClass: ProfessionalRepository },
  ],
})
export class MemberManagementModule {}
