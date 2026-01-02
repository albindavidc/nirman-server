import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';

// Controller
import { MemberController } from '../controllers/member.controller';

// Query Handlers
import { GetMembersHandler } from '../../application/handlers/queries/member/get-members.handler';

// Command Handlers
import { CreateMemberHandler } from '../../application/handlers/commands/member/create-member.handler';
import { UpdateMemberHandler } from '../../application/handlers/commands/member/update-member.handler';
import {
  BlockMemberHandler,
  UnblockMemberHandler,
} from '../../application/handlers/commands/member/block-member.handler';

const QueryHandlers = [GetMembersHandler];
const CommandHandlers = [
  CreateMemberHandler,
  UpdateMemberHandler,
  BlockMemberHandler,
  UnblockMemberHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [MemberController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class MemberModule {}
