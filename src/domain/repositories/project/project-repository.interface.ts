import { IProjectReader } from './project.reader.interface';
import { IProjectWriter } from './project.writer.interface';
import { IProjectQueryReader } from './project.query-reader.interface';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface IProjectRepository
  extends IProjectReader, IProjectWriter, IProjectQueryReader {}
