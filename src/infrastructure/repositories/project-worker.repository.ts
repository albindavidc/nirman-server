import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IProjectWorkerRepository,
  ProjectWorkerData,
  ProjectWorkerWithUser,
  AddWorkerData,
} from '../../domain/repositories/project-worker-repository.interface';

@Injectable()
export class ProjectWorkerRepository implements IProjectWorkerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectId(projectId: string): Promise<ProjectWorkerWithUser[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (!project.members || project.members.length === 0) {
      return [];
    }

    // Get user details for all workers
    const userIds = project.members.map((m) => m.user_id);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      include: {
        professional: true,
      },
    });

    // Map users to worker response
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

  async addWorkers(
    projectId: string,
    workers: AddWorkerData[],
  ): Promise<{ addedCount: number; workers: ProjectWorkerData[] }> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Get existing worker IDs to avoid duplicates
    const existingWorkerIds = project.members.map((m) => m.user_id);
    const newWorkers = workers.filter(
      (m) => !existingWorkerIds.includes(m.userId),
    );

    if (newWorkers.length === 0) {
      return {
        addedCount: 0,
        workers: project.members.map((m) => ({
          userId: m.user_id,
          role: m.role,
          joinedAt: m.joined_at,
          isCreator: (m as { is_creator?: boolean }).is_creator ?? false,
        })),
      };
    }

    // Create new worker entries
    const newWorkerEntries = newWorkers.map((worker) => ({
      user_id: worker.userId,
      role: worker.role,
      joined_at: new Date(),
      is_creator: false,
    }));

    // Update project with new workers
    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        members: {
          push: newWorkerEntries,
        },
      },
    });

    return {
      addedCount: newWorkers.length,
      workers: updatedProject.members.map((m) => ({
        userId: m.user_id,
        role: m.role,
        joinedAt: m.joined_at,
        isCreator: (m as { is_creator?: boolean }).is_creator ?? false,
      })),
    };
  }

  async removeWorker(
    projectId: string,
    userId: string,
  ): Promise<ProjectWorkerData[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user is a worker
    const workerIndex = project.members.findIndex((m) => m.user_id === userId);
    if (workerIndex === -1) {
      throw new NotFoundException('User is not a worker of this project');
    }

    // Remove worker from array
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

  async updateWorkerRole(
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

    const workerIndex = project.members.findIndex((m) => m.user_id === userId);
    if (workerIndex === -1) {
      throw new NotFoundException('Worker not found in project');
    }

    // Update the worker role
    const updatedMembers = [...project.members];
    updatedMembers[workerIndex] = {
      ...updatedMembers[workerIndex],
      role,
    };

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        members: updatedMembers,
      },
    });
  }

  async isWorker(projectId: string, userId: string): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return false;
    }

    return project.members.some((m) => m.user_id === userId);
  }

  async getWorkerIds(projectId: string): Promise<string[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return [];
    }

    return project.members.map((m) => m.user_id);
  }
}
