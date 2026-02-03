import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IProjectMemberRepository,
  ProjectMemberData,
  ProjectMemberWithUser,
  AddMemberData,
} from '../../../../domain/repositories/project-member-repository.interface';

@Injectable()
export class ProjectMemberRepository implements IProjectMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectId(projectId: string): Promise<ProjectMemberWithUser[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (!project.members || project.members.length === 0) {
      return [];
    }

    // Get user details for all members
    const userIds = project.members.map((m) => m.user_id);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      include: {
        professional: true,
      },
    });

    // Map users to member response
    return project.members.map((member) => {
      const user = users.find((u) => u.id === member.user_id);
      return {
        userId: member.user_id,
        role: member.role,
        joinedAt: member.joined_at,
        isCreator: (member as { is_creator?: boolean }).is_creator ?? false,
        user: user
          ? {
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              fullName: `${user.first_name} ${user.last_name}`,
              email: user.email,
              phone: user.phone_number,
              profilePhoto: user.profile_photo_url,
              title: user.professional?.professional_title || '',
            }
          : null,
      };
    });
  }

  async addMembers(
    projectId: string,
    members: AddMemberData[],
  ): Promise<{ addedCount: number; members: ProjectMemberData[] }> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Get existing member IDs to avoid duplicates
    const existingMemberIds = project.members.map((m) => m.user_id);
    const newMembers = members.filter(
      (m) => !existingMemberIds.includes(m.userId),
    );

    if (newMembers.length === 0) {
      return {
        addedCount: 0,
        members: project.members.map((m) => ({
          userId: m.user_id,
          role: m.role,
          joinedAt: m.joined_at,
          isCreator: (m as { is_creator?: boolean }).is_creator ?? false,
        })),
      };
    }

    // Create new member entries
    const newMemberEntries = newMembers.map((member) => ({
      user_id: member.userId,
      role: member.role,
      joined_at: new Date(),
      is_creator: false,
    }));

    // Update project with new members
    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        members: {
          push: newMemberEntries,
        },
      },
    });

    return {
      addedCount: newMembers.length,
      members: updatedProject.members.map((m) => ({
        userId: m.user_id,
        role: m.role,
        joinedAt: m.joined_at,
        isCreator: (m as { is_creator?: boolean }).is_creator ?? false,
      })),
    };
  }

  async removeMember(
    projectId: string,
    userId: string,
  ): Promise<ProjectMemberData[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user is a member
    const memberIndex = project.members.findIndex((m) => m.user_id === userId);
    if (memberIndex === -1) {
      throw new NotFoundException('User is not a member of this project');
    }

    // Remove member from array
    const updatedMembers = project.members.filter((m) => m.user_id !== userId);

    // Update project
    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        members: updatedMembers,
      },
    });

    return updatedProject.members.map((m) => ({
      userId: m.user_id,
      role: m.role,
      joinedAt: m.joined_at,
      isCreator: (m as { is_creator?: boolean }).is_creator ?? false,
    }));
  }

  async updateMemberRole(
    projectId: string,
    userId: string,
    role: string,
  ): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const memberIndex = project.members.findIndex((m) => m.user_id === userId);
    if (memberIndex === -1) {
      throw new NotFoundException('Member not found in project');
    }

    // Update the member role
    const updatedMembers = [...project.members];
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      role,
    };

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        members: updatedMembers,
      },
    });
  }

  async isMember(projectId: string, userId: string): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return false;
    }

    return project.members.some((m) => m.user_id === userId);
  }

  async getMemberIds(projectId: string): Promise<string[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return [];
    }

    return project.members.map((m) => m.user_id);
  }
}
