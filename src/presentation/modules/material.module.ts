import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MaterialController } from '../controllers/material.controller';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

// Material repositories
import { MaterialRepository } from '../../infrastructure/repositories/project-material/material.repository';
import { MaterialQueryRepository } from '../../infrastructure/repositories/project-material/material.query-repository';
import { MATERIAL_READER } from '../../domain/repositories/project-material/material.reader.interface';
import { MATERIAL_WRITER } from '../../domain/repositories/project-material/material.writer.interface';
import { MATERIAL_QUERY_READER } from '../../domain/repositories/project-material/material.query-reader.interface';

// MaterialRequest repositories
import { MaterialRequestRepository } from '../../infrastructure/repositories/project-material/material-request.repository';
import { MaterialRequestQueryRepository } from '../../infrastructure/repositories/project-material/material-request.query-repository';
import { MATERIAL_REQUEST_READER } from '../../domain/repositories/project-material/material-request.reader.interface';
import { MATERIAL_REQUEST_WRITER } from '../../domain/repositories/project-material/material-request.writer.interface';
import { MATERIAL_REQUEST_QUERY_READER } from '../../domain/repositories/project-material/material-request.query-reader.interface';

// MaterialTransaction repositories
import { MaterialTransactionRepository } from '../../infrastructure/repositories/project-material/material-transaction.repository';
import { MaterialTransactionQueryRepository } from '../../infrastructure/repositories/project-material/material-transaction.query-repository';
import { MATERIAL_TRANSACTION_READER } from '../../domain/repositories/project-material/material-transaction.reader.interface';
import { MATERIAL_TRANSACTION_WRITER } from '../../domain/repositories/project-material/material-transaction.writer.interface';
import { MATERIAL_TRANSACTION_QUERY_READER } from '../../domain/repositories/project-material/material-transaction.query-reader.interface';

// Handlers
import { GetProjectMaterialsHandler } from '../../application/handlers/queries/material/get-project-materials.handler';
import { GetMaterialTransactionsHandler } from '../../application/handlers/queries/material/get-material-transactions.handler';
import { GetProjectMaterialRequestsHandler } from '../../application/handlers/queries/material/get-project-material-requests.handler';
import { CreateMaterialHandler } from '../../application/handlers/commands/material/create-material.handler';
import { UpdateMaterialStockHandler } from '../../application/handlers/commands/material/update-material-stock.handler';
import { UpdateMaterialHandler } from '../../application/handlers/commands/material/update-material.handler';
import { DeleteMaterialHandler } from '../../application/handlers/commands/material/delete-material.handler';
import { CreateMaterialRequestHandler } from '../../application/handlers/commands/material/create-material-request.handler';

const QueryHandlers = [
  GetProjectMaterialsHandler,
  GetMaterialTransactionsHandler,
  GetProjectMaterialRequestsHandler,
];
const CommandHandlers = [
  CreateMaterialHandler,
  UpdateMaterialStockHandler,
  UpdateMaterialHandler,
  DeleteMaterialHandler,
  CreateMaterialRequestHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [MaterialController],
  providers: [
    /**
     * ISP / DIP — every concrete class is bound to its precise interface token.
     * Handlers inject only the narrow token they need.
     */

    // Material
    { provide: MATERIAL_READER, useClass: MaterialRepository },
    { provide: MATERIAL_WRITER, useClass: MaterialRepository },
    { provide: MATERIAL_QUERY_READER, useClass: MaterialQueryRepository },

    // MaterialRequest
    { provide: MATERIAL_REQUEST_READER, useClass: MaterialRequestRepository },
    { provide: MATERIAL_REQUEST_WRITER, useClass: MaterialRequestRepository },
    {
      provide: MATERIAL_REQUEST_QUERY_READER,
      useClass: MaterialRequestQueryRepository,
    },

    // MaterialTransaction
    {
      provide: MATERIAL_TRANSACTION_READER,
      useClass: MaterialTransactionRepository,
    },
    {
      provide: MATERIAL_TRANSACTION_WRITER,
      useClass: MaterialTransactionRepository,
    },
    {
      provide: MATERIAL_TRANSACTION_QUERY_READER,
      useClass: MaterialTransactionQueryRepository,
    },

    ...QueryHandlers,
    ...CommandHandlers,
  ],
  exports: [],
})
export class MaterialModule {}
