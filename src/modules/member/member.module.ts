import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MemberController } from 'src/modules/member/presentation/member.controller';
import { GetMembersHandler } from 'src/modules/member/application/handlers/get-members.handler';
import { AddMemberHandler } from 'src/modules/member/application/handlers/add-member.handler';
import { EditMemberHandler } from 'src/modules/member/application/handlers/edit-member.handler';
import { BlockMemberHandler } from 'src/modules/member/application/handlers/block-member.handler';
import { UserRepository } from 'src/modules/user/infrastructure/persistence/user.repository';
import { ProfessionalRepository } from 'src/modules/member/infrastructure/persistence/professional.repository';
import { USER_REPOSITORY,  } from 'src/modules/user/domain/repositories/IUserRepository';
import { PROFESSIONAL_REPOSITORY } from 'src/modules/member/domain/repositories/IProfessionalRepository';

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
