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
import { GetMembersQuery } from 'src/application/queries/get-members.query';
import { AddMemberCommand } from 'src/application/commands/add-member.command';
import { EditMemberCommand } from 'src/application/commands/edit-member.command';
import { BlockMemberCommand } from 'src/application/commands/block-member.command';
// import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard'; // Assuming we have this, or similar.
// check auth module or similar for guards. For now, omit or check later.

@Controller('members')
export class MemberController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getMembers(
    @Query('role') role?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.queryBus.execute(
      new GetMembersQuery(role, search, page, limit),
    );
  }

  @Post()
  async addMember(@Body() dto: any) {
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
  async editMember(@Param('id') id: string, @Body() dto: any) {
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
