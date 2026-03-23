import { validate } from 'class-validator';
import 'reflect-metadata';
import { CreateProjectDto, ProjectWorkerDto } from './src/application/dto/project/create-project.dto';
import { ProjectStatus } from './src/domain/enums/project-status.enum';
import { ProjectRole } from './src/domain/enums/project-role.enum';
import { plainToInstance } from 'class-transformer';

async function test() {
  const payloads = [
    {
      name: "Test Project",
      managerIds: [],
      status: "active",
      progress: "0", // String instead of number
      startDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      workers: [
        {
          userId: "cf461244-9f89-49dd-b166-51fcf5d5c0f1",
          role: "Worker",
          joinedAt: new Date().toISOString()
        }
      ]
    },
    {
      name: "T", // Fails MinLength(2)
      managerIds: [],
      status: "active",
      progress: 0,
    },
    {
      name: "Valid Project",
      managerIds: [],
      status: "active",
      budget: null, // Null test
      progress: 0,
      workers: []
    }
  ];

  for (let i = 0; i < payloads.length; i++) {
    const dtoObj = plainToInstance(CreateProjectDto, payloads[i]);
    const errors = await validate(dtoObj, { whitelist: true, forbidNonWhitelisted: true });
    console.log(`Payload ${i} errors:`, JSON.stringify(errors.map(e => ({ property: e.property, constraints: e.constraints })), null, 2));
  }
}

test().catch(console.error);
