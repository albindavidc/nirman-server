import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetMembersQuery } from 'src/modules/member/application/queries/get-members.query';
import { AddMemberCommand } from 'src/modules/member/application/commands/add-member.command';
import { EditMemberCommand } from 'src/modules/member/application/commands/edit-member.command';
import { BlockMemberCommand } from 'src/modules/member/application/commands/block-member.command';
import { CreateMemberDto } from '../application/dto/create-member.dto';
import { UpdateMemberDto } from '../application/dto/update-member.dto';
import { GetMembersQueryDto } from '../application/dto/get-members-query.dto';
// import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'; // Assuming we have this, or similar.
// check auth module or similar for guards. For now, omit or check later.

@Controller('members')
export class MemberController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getMembers(@Query() query: GetMembersQueryDto) {
    return this.queryBus.execute(
      new GetMembersQuery(query.role, query.search, query.page, query.limit),
    );
  }

  @Post()
  async addMember(@Body() dto: CreateMemberDto) {
    return this.commandBus.execute(
      new AddMemberCommand(
        dto.firstName,
        dto.lastName,
        dto.email,
        dto.phone,
        dto.role,
        dto.professionalTitle,
        dto.experienceYears,
        dto.skills,
        dto.addressStreet,
        dto.addressCity,
        dto.addressState,
        dto.addressZipCode,
      ),
    );
  }

  @Put(':id')
  async editMember(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.commandBus.execute(
      new EditMemberCommand(
        id,
        dto.firstName,
        dto.lastName,
        dto.email,
        dto.phone,
        dto.role,
        dto.professionalTitle,
        dto.experienceYears,
        dto.skills,
        dto.addressStreet,
        dto.addressCity,
        dto.addressState,
        dto.addressZipCode,
      ),
    );
  }

  @Put(':id/block')
  async blockMember(@Param('id') id: string) {
    return this.commandBus.execute(new BlockMemberCommand(id, true));
  }

  @Put(':id/unblock')
  async unblockMember(@Param('id') id: string) {
    return this.commandBus.execute(new BlockMemberCommand(id, false));
  }
}
