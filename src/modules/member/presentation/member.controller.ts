import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetMembersQuery } from 'src/modules/member/application/queries/get-members.query';
import { AddMemberCommand } from 'src/modules/member/application/commands/add-member.command';
import { EditMemberCommand } from 'src/modules/member/application/commands/edit-member.command';
import { BlockMemberCommand } from 'src/modules/member/application/commands/block-member.command';
import { CreateMemberDto } from '../application/dto/create-member.dto';
import { UpdateMemberDto } from '../application/dto/update-member.dto';
import { GetMembersQueryDto } from '../application/dto/get-members-query.dto';

import { PaginatedMembersResponseDto } from '../application/dto/paginated-members-response.dto';
import { MemberResponseDto } from '../application/dto/member.response.dto';
import { UserPersistence } from 'src/modules/user/domain/repositories/user-repository.interface';

import { MEMBER_ROUTES } from 'src/app.routes';

@Controller(MEMBER_ROUTES.ROOT)
export class MemberController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(MEMBER_ROUTES.GET_MEMBERS)
  async getMembers(
    @Query() query: GetMembersQueryDto,
  ): Promise<PaginatedMembersResponseDto> {
    return this.queryBus.execute<PaginatedMembersResponseDto>(
      new GetMembersQuery(query.role, query.search, query.page, query.limit),
    );
  }

  @Post(MEMBER_ROUTES.ADD_MEMBER)
  async addMember(@Body() dto: CreateMemberDto): Promise<MemberResponseDto> {
    return this.commandBus.execute<MemberResponseDto>(
      new AddMemberCommand(dto),
    );
  }

  @Put(MEMBER_ROUTES.EDIT_MEMBER)
  async editMember(
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto,
  ): Promise<UserPersistence> {
    return this.commandBus.execute<UserPersistence>(
      new EditMemberCommand(id, dto),
    );
  }

  @Put(MEMBER_ROUTES.BLOCK_MEMBER)
  async blockMember(@Param('id') id: string): Promise<MemberResponseDto> {
    return this.commandBus.execute<MemberResponseDto>(
      new BlockMemberCommand(id, true),
    );
  }

  @Put(MEMBER_ROUTES.UNBLOCK_MEMBER)
  async unblockMember(@Param('id') id: string): Promise<MemberResponseDto> {
    return this.commandBus.execute<MemberResponseDto>(
      new BlockMemberCommand(id, false),
    );
  }
}
