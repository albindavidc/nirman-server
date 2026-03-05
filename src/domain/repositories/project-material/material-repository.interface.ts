import { IMaterialReader } from './material.reader.interface';
import { IMaterialWriter } from './material.writer.interface';
import { IMaterialQueryReader } from './material.query-reader.interface';

export const MATERIAL_REPOSITORY = Symbol('MATERIAL_REPOSITORY');

/**
 * ISP — Composite repository that composes all three segregated interfaces.
 * Handlers inject the narrow interface they need — not this composite.
 */
export interface IMaterialRepository
  extends IMaterialReader, IMaterialWriter, IMaterialQueryReader {}
