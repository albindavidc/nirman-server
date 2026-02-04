/**
 * Project Member Repository Interface
 */

import { ProjectMember } from '../types';

export type ProjectMemberData = ProjectMember;

export interface ProjectMemberWithUser extends ProjectMember {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string | null;
    profilePhoto: string | null;
    title: string;
  } | null;
}

export interface AddMemberData {
  userId: string;
  role: string;
}

export interface IProjectMemberRepository {
  /**
   * Get all members of a project with user details
   */
  findByProjectId(projectId: string): Promise<ProjectMemberWithUser[]>;

  /**
   * Add multiple members to a project
   * Returns the IDs of members that were actually added (excluding duplicates)
   */
  addMembers(
    projectId: string,
    members: AddMemberData[],
  ): Promise<{ addedCount: number; members: ProjectMemberData[] }>;

  /**
   * Remove a member from a project
   */
  removeMember(projectId: string, userId: string): Promise<ProjectMemberData[]>;

  /**
   * Update a member's role in a project
   */
  updateMemberRole(
    projectId: string,
    userId: string,
    role: string,
  ): Promise<void>;

  /**
   * Check if a user is a member of a project
   */
  isMember(projectId: string, userId: string): Promise<boolean>;

  /**
   * Get existing member IDs for a project
   */
  getMemberIds(projectId: string): Promise<string[]>;
}

/**
 * Injection token for the Project Member repository
 */
export const PROJECT_MEMBER_REPOSITORY = Symbol('PROJECT_MEMBER_REPOSITORY');
