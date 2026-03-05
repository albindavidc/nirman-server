import { IMaterialRequestReader } from './material-request.reader.interface';
import { IMaterialRequestWriter } from './material-request.writer.interface';
import { IMaterialRequestQueryReader } from './material-request.query-reader.interface';

/**
 * DIP — Symbol token for injection binding.
 * Application layer injects this token; infrastructure provides the concrete class.
 */
export const MATERIAL_REQUEST_REPOSITORY = Symbol('IMaterialRequestRepository');

/**
 * ISP — Composite repository interface that composes all three segregated
 * interfaces. Never a fat interface with methods added directly.
 */
export interface IMaterialRequestRepository
  extends
    IMaterialRequestReader,
    IMaterialRequestWriter,
    IMaterialRequestQueryReader {}
