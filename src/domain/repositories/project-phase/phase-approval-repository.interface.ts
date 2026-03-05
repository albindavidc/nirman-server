/**
 * Phase Approval Repository Interfaces
 *
 * Segregated per ISP:
 *   IPhaseApprovalReader      — single-record existence / point lookups
 *   IPhaseApprovalWriter      — write operations (create)
 *   IPhaseApprovalQueryReader — paginated / bulk reads and projections
 *   IPhaseApprovalRepository  — composition of all three (used by module provider)
 */
import { ApprovalStatus } from '../../enums/approval-status.enum';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

// ─── Shared value types ───────────────────────────────────────────────────────

export interface PhaseApprovalMedia {
  type: string;
  url: string;
}

// ─── Command / write input ────────────────────────────────────────────────────

export interface CreatePhaseApprovalData {
  phaseId: string;
  approvedBy?: string;
  requestedBy: string;
  approvalStatus: ApprovalStatus;
  comments: string | null;
  media: PhaseApprovalMedia[];
}

// ─── Query / read result ──────────────────────────────────────────────────────

export interface PhaseApprovalResult {
  id: string;
  phaseId: string;
  phaseName?: string;
  projectId?: string;
  projectName?: string;
  approvedBy: string | null;
  approverFirstName: string | null;
  approverLastName: string | null;
  requestedBy: string;
  requesterFirstName: string;
  requesterLastName: string;
  approvalStatus: ApprovalStatus;
  comments: string | null;
  media: PhaseApprovalMedia[];
  approvedAt: Date | null;
  requestedAt: Date;
  createdAt: Date;
}

// ─── ISP — Reader ─────────────────────────────────────────────────────────────

/**
 * Point lookups and existence checks only.
 * Inject this token in validators and guards that never write.
 */
export interface IPhaseApprovalReader {
  findLatestByPhaseId(
    phaseId: string,
    tx?: ITransactionContext,
  ): Promise<PhaseApprovalResult | null>;
}

export const PHASE_APPROVAL_READER = Symbol('IPhaseApprovalReader');

// ─── ISP — Writer ─────────────────────────────────────────────────────────────

/**
 * Write operations only.
 * Inject this token in command handlers.
 */
export interface IPhaseApprovalWriter {
  create(
    data: CreatePhaseApprovalData,
    tx?: ITransactionContext,
  ): Promise<PhaseApprovalResult>;
}

export const PHASE_APPROVAL_WRITER = Symbol('IPhaseApprovalWriter');

// ─── ISP — QueryReader ────────────────────────────────────────────────────────

/**
 * Bulk reads, projections, paginated queries.
 * Inject this token in query handlers.
 */
export interface IPhaseApprovalQueryReader {
  findByPhaseId(
    phaseId: string,
    tx?: ITransactionContext,
  ): Promise<PhaseApprovalResult[]>;

  findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<PhaseApprovalResult[]>;

  findAll(tx?: ITransactionContext): Promise<PhaseApprovalResult[]>;
}

export const PHASE_APPROVAL_QUERY_READER = Symbol('IPhaseApprovalQueryReader');

// ─── Composite — full repository ──────────────────────────────────────────────

/**
 * Composes all three sub-interfaces.
 * Used by the module provider binding — never injected directly into handlers.
 */
export interface IPhaseApprovalRepository
  extends
    IPhaseApprovalReader,
    IPhaseApprovalWriter,
    IPhaseApprovalQueryReader {}

/**
 * Injection token for the composite Phase Approval repository.
 * Module provides: { provide: PHASE_APPROVAL_REPOSITORY, useClass: PhaseApprovalRepository }
 */
export const PHASE_APPROVAL_REPOSITORY = Symbol('IPhaseApprovalRepository');
