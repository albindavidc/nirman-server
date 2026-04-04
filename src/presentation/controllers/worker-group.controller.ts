import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TradeType } from 'src/domain/enums/trade-type.enum';
import { GetProjectGroupQuery } from 'src/application/queries/worker/worker-group/get-project-groups.query';
import { GetWorkerGroupByIdQuery } from 'src/application/queries/worker/worker-group/get-worker-group-by-id.query';
import { WORKER_GROUP_ROUTES } from 'src/common/constants/routes.constants';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/common/security/decorators/roles.decorator';
import { Role } from 'src/domain/enums/role.enum';
import { CreateWorkerGroupDto } from 'src/application/dto/worker/worker-group/create-worker-group.dto';
import { AddMemberCommand, CreateWorkerGroupCommand, DeleteWorkerGroupCommand, RemoveMemberCommand, UpdateWorkerGroupCommand } from 'src/application/commands/worker/worker-group';
import { UpdateWorkerGroupDto } from 'src/application/dto/worker/worker-group/update-worker-group.dto';
import { AddMemberDto } from 'src/application/dto/worker/worker-group/add-member.dto';

@Controller(WORKER_GROUP_ROUTES.ROOT)
@Roles(Role.ADMIN, Role.SUPERVISOR)
export class WorkerGroupController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Quries
   */
  @Get()
  getProjectGroups(
    @Query('trade') trade?: TradeType,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
  ) {
    return this.queryBus.execute(
      new GetProjectGroupQuery(
        trade,
        isActive !== undefined ? isActive : undefined,
        search,
      ),
    );
  }

  @Get(WORKER_GROUP_ROUTES.GET_WORKER_GROUP_BY_ID)
  getProjectGroupById(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.queryBus.execute(new GetWorkerGroupByIdQuery(id, true));
  }

  /**
   * Commands
   */
  @Post('create')
  async create(
    @Body() dto: CreateWorkerGroupDto,
    @User('userId') userId: string,
  ) {
    return this.commandBus.execute(
      new CreateWorkerGroupCommand(
        dto.name,
        dto.description,
        dto.trade as TradeType,
        userId,
        dto.workerIds || [],
      ),
    );
  }

  @Patch(WORKER_GROUP_ROUTES.GET_WORKER_GROUP_BY_ID)
  updateGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkerGroupDto,
    @User('userId') userId: string,
  ) {
    return this.commandBus.execute(
      new UpdateWorkerGroupCommand(
        id,
        userId,
        dto.name,
        dto.description,
        dto.trade as TradeType,
        dto.isActive,
      ),
    );
  }

  @Delete(WORKER_GROUP_ROUTES.GET_WORKER_GROUP_BY_ID)
  deleteGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @User('userId') userId: string,
  ) {
    return this.commandBus.execute(
      new DeleteWorkerGroupCommand(id, userId),
    );
  }

  @Post(WORKER_GROUP_ROUTES.ADD_WORKER_TO_GROUP)
  addMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddMemberDto,
    @User('userId') userId: string,
  ) {
    return this.commandBus.execute(
      new AddMemberCommand(id, dto.workerId, userId),
    );
  }

  @Delete(WORKER_GROUP_ROUTES.REMOVE_WORKER_FROM_GROUP)
  removeMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('workerId', ParseUUIDPipe) workerId: string,
    @User('userId') userId: string,
  ) {
    return this.commandBus.execute(
      new RemoveMemberCommand(id, workerId, userId),
    );
  }
}
