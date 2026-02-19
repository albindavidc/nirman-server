import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetMembersQuery } from '../../application/queries/member/get-members.query';
import { CreateMemberCommand } from '../../application/commands/member/create-member.command';
import { UpdateMemberCommand } from '../../application/commands/member/update-member.command';
import {
  BlockMemberCommand,
  UnblockMemberCommand,
} from '../../application/commands/member/block-member.command';
import { CreateMemberDto } from '../../application/dto/member/create-member.dto';
import { UpdateMemberDto } from '../../application/dto/member/update-member.dto';
import {
  MemberResponseDto,
  MemberListResponseDto,
} from '../../application/dto/member/member-response.dto';
import { Roles } from '../../common/security/decorators/roles.decorator';

import { MEMBER_ROUTES } from '../../common/constants/routes.constants';

@Controller(MEMBER_ROUTES.ROOT)
export class MemberController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(MEMBER_ROUTES.GET_MEMBERS)
  @Roles('admin', 'supervisor')
  async getMembers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('role') role?: string,
    @Query('search') search?: string,
  ): Promise<MemberListResponseDto> {
    return this.queryBus.execute(
      new GetMembersQuery(page, limit, role, search),
    );
  }

  @Post(MEMBER_ROUTES.ADD_MEMBER)
  @Roles('admin')
  async createMember(@Body() dto: CreateMemberDto): Promise<MemberResponseDto> {
    return this.commandBus.execute(new CreateMemberCommand(dto));
  }

  @Put(MEMBER_ROUTES.EDIT_MEMBER)
  @Roles('admin', 'supervisor')
  async updateMember(
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto,
  ): Promise<MemberResponseDto> {
    return this.commandBus.execute(new UpdateMemberCommand(id, dto));
  }

  @Put(MEMBER_ROUTES.BLOCK_MEMBER)
  @Roles('admin')
  async blockMember(@Param('id') id: string): Promise<MemberResponseDto> {
    return this.commandBus.execute(new BlockMemberCommand(id));
  }

  @Put(MEMBER_ROUTES.UNBLOCK_MEMBER)
  @Roles('admin')
  async unblockMember(@Param('id') id: string): Promise<MemberResponseDto> {
    return this.commandBus.execute(new UnblockMemberCommand(id));
  }
}
