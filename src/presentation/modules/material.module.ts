import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MaterialController } from '../controllers/material.controller';
import { MaterialRepository } from '../../infrastructure/repositories/material.repository';
import { GetProjectMaterialsHandler } from '../../application/handlers/queries/material/get-project-materials.handler';
import { CreateMaterialHandler } from '../../application/handlers/commands/material/create-material.handler';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { MaterialRequestRepository } from '../../infrastructure/repositories/material-request.repository';
import { MaterialTransactionRepository } from '../../infrastructure/repositories/material-transaction.repository';
import { UpdateMaterialStockHandler } from '../../application/handlers/commands/material/update-material-stock.handler';
import { GetMaterialTransactionsHandler } from '../../application/handlers/queries/material/get-material-transactions.handler';
import { CreateMaterialRequestHandler } from '../../application/handlers/commands/material/create-material-request.handler';
import { GetProjectMaterialRequestsHandler } from '../../application/handlers/queries/material/get-project-material-requests.handler';

const QueryHandlers = [
  GetProjectMaterialsHandler,
  GetMaterialTransactionsHandler,
  GetProjectMaterialRequestsHandler,
];
const CommandHandlers = [
  CreateMaterialHandler,
  UpdateMaterialStockHandler,
  CreateMaterialRequestHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [MaterialController],
  providers: [
    MaterialRepository,
    MaterialTransactionRepository,
    MaterialRequestRepository,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
  exports: [MaterialRepository],
})
export class MaterialModule {}
