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

@Controller('members')
export class MemberController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getMembers(
    @Query() query: GetMembersQueryDto,
  ): Promise<PaginatedMembersResponseDto> {
    return this.queryBus.execute<PaginatedMembersResponseDto>(
      new GetMembersQuery(query.role, query.search, query.page, query.limit),
    );
  }

  @Post()
  async addMember(@Body() dto: CreateMemberDto): Promise<MemberResponseDto> {
    return this.commandBus.execute<MemberResponseDto>(
      new AddMemberCommand(dto),
    );
  }

  @Put(':id')
  async editMember(
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto,
  ): Promise<UserPersistence> {
    return this.commandBus.execute<UserPersistence>(
      new EditMemberCommand(id, dto),
    );
  }

  @Put(':id/block')
  async blockMember(@Param('id') id: string): Promise<MemberResponseDto> {
    return this.commandBus.execute<MemberResponseDto>(
      new BlockMemberCommand(id, true),
    );
  }

  @Put(':id/unblock')
  async unblockMember(@Param('id') id: string): Promise<MemberResponseDto> {
    return this.commandBus.execute<MemberResponseDto>(
      new BlockMemberCommand(id, false),
    );
  }
}
