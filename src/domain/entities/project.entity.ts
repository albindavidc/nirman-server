import { BaseEntity } from './base.entity';
import { ProjectStatus } from '../enums/project-status.enum';

export class Project extends BaseEntity {
  name: string;
  description?: string;
  icon: string;
  status: ProjectStatus;
  progress: number;
  budget?: number;
  spent?: number;
  startDate?: Date;
  dueDate?: Date;
  teamMemberIds: string[];
  createdBy: string;

  constructor(props: Partial<Project>) {
    super();
    this.id = props.id ?? '';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.name = props.name!;
    this.description = props.description;
    this.icon = props.icon ?? 'folder';
    this.status = props.status ?? ProjectStatus.ACTIVE;
    this.progress = props.progress ?? 0;
    this.budget = props.budget;
    this.spent = props.spent;
    this.startDate = props.startDate;
    this.dueDate = props.dueDate;
    this.teamMemberIds = props.teamMemberIds ?? [];
    this.createdBy = props.createdBy!;
  }
}
