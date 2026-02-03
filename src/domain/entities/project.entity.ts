import { BaseEntity } from './base.entity';
import { ProjectStatus } from '../enums/project-status.enum';
import { ProjectPhase } from './project-phase.entity';

import { ProjectMember } from '../types';

export class Project extends BaseEntity {
  name: string;
  managerIds: string[];
  description?: string;
  icon: string;
  status: ProjectStatus;
  progress: number;
  budget?: number;
  spent?: number;
  startDate?: Date;
  dueDate?: Date;
  latitude?: number;
  longitude?: number;
  members: ProjectMember[];
  phases: ProjectPhase[];

  constructor(props: Partial<Project>) {
    super();
    this.id = props.id ?? '';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.name = props.name!;
    this.managerIds = props.managerIds ?? [];
    this.description = props.description;
    this.icon = props.icon ?? 'folder';
    this.status = props.status ?? ProjectStatus.ACTIVE;
    this.progress = props.progress ?? 0;
    this.budget = props.budget;
    this.spent = props.spent;
    this.startDate = props.startDate;
    this.dueDate = props.dueDate;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.members = props.members ?? [];
    this.phases = props.phases ?? [];
  }
}
