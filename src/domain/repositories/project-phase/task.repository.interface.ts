import { ITaskReader } from './task.reader.interface';
import { ITaskWriter } from './task.writer.interface';
import { ITaskQueryReader } from './task.query-repository.interface';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface ITaskRepository
  extends ITaskReader, ITaskWriter, ITaskQueryReader {}
