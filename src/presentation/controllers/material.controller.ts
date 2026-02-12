import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/security/guards/jwt-auth.guard';
import { GetProjectMaterialsQuery } from '../../application/queries/material/get-project-materials.query';
import { CreateMaterialCommand } from '../../application/commands/material/create-material.command';
import { UpdateMaterialStockCommand } from '../../application/commands/material/update-material-stock.command';
import { UpdateMaterialCommand } from '../../application/commands/material/update-material.command';
import { DeleteMaterialCommand } from '../../application/commands/material/delete-material.command';
import { CreateMaterialRequestCommand } from '../../application/commands/material/create-material-request.command';
import { GetMaterialTransactionsQuery } from '../../application/queries/material/get-material-transactions.query';
import { GetProjectMaterialRequestsQuery } from '../../application/queries/material/get-project-material-requests.query';

import {
  CreateMaterialDto,
  UpdateMaterialDto,
  MaterialDto,
} from '../../application/dto/material/material.dto';
import {
  CreateMaterialTransactionDto,
  MaterialTransactionDto,
} from '../../application/dto/material/transaction.dto';
import {
  CreateMaterialRequestDto,
  MaterialRequestDto,
} from '../../application/dto/material/request.dto';

import { MATERIAL_ROUTES } from '../../app.routes';

@Controller(MATERIAL_ROUTES.ROOT)
@UseGuards(JwtAuthGuard)
export class MaterialController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(MATERIAL_ROUTES.GET_PROJECT_MATERIALS)
  async getProjectMaterials(
    @Param('projectId') projectId: string,
  ): Promise<MaterialDto[]> {
    return this.queryBus.execute(new GetProjectMaterialsQuery(projectId));
  }

  @Post(MATERIAL_ROUTES.CREATE_MATERIAL)
  async createMaterial(
    @Param('projectId') projectId: string,
    @Body() dto: CreateMaterialDto,
    @Request() req: { user: { userId: string } },
  ): Promise<MaterialDto> {
    return this.commandBus.execute(
      new CreateMaterialCommand(projectId, req.user.userId, dto),
    );
  }

  @Post(':id')
  async updateMaterial(
    @Param('id') id: string,
    @Body() dto: UpdateMaterialDto,
    @Request() req: { user: { userId: string } },
  ): Promise<MaterialDto> {
    return this.commandBus.execute(
      new UpdateMaterialCommand(id, req.user.userId, dto),
    );
  }

  @Delete(':id')
  async deleteMaterial(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteMaterialCommand(id, req.user.userId),
    );
  }
  @Post(MATERIAL_ROUTES.UPDATE_STOCK)
  async updateStock(
    @Param('id') id: string,
    @Body() dto: CreateMaterialTransactionDto,
    @Request() req: { user: { userId: string } },
  ): Promise<MaterialTransactionDto> {
    const userId = req.user.userId;
    return this.commandBus.execute(
      new UpdateMaterialStockCommand(id, userId, dto),
    );
  }

  @Get(MATERIAL_ROUTES.GET_TRANSACTIONS)
  async getTransactions(
    @Param('id') id: string,
  ): Promise<MaterialTransactionDto[]> {
    return this.queryBus.execute(new GetMaterialTransactionsQuery(id));
  }

  @Post(MATERIAL_ROUTES.CREATE_REQUEST)
  async createRequest(
    @Body() dto: CreateMaterialRequestDto,
    @Request() req: { user: { userId: string } },
  ): Promise<MaterialRequestDto> {
    const userId = req.user.userId;
    return this.commandBus.execute(
      new CreateMaterialRequestCommand(userId, dto),
    );
  }

  @Get(MATERIAL_ROUTES.GET_PROJECT_REQUESTS)
  async getProjectRequests(
    @Param('projectId') projectId: string,
  ): Promise<MaterialRequestDto[]> {
    return this.queryBus.execute(
      new GetProjectMaterialRequestsQuery(projectId),
    );
  }
}
