import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IProjectsRepository } from '../common/repositories';
import { Project } from '../common/interfaces';
import { CreateProjectDto, UpdateProjectDto } from './projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepo: IProjectsRepository) {}

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      ownerId: userId,
      memberIds: [userId],
      createdAt: now,
      updatedAt: now,
    };
    return this.projectsRepo.save(project);
  }

  async findAllForUser(userId: string): Promise<Project[]> {
    return this.projectsRepo.findByMemberId(userId);
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectsRepo.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    if (!project.memberIds.includes(userId))
      throw new ForbiddenException('Access denied');
    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(id, userId);
    if (project.ownerId !== userId)
      throw new ForbiddenException('Only owner can update');
    const updated: Project = {
      ...project,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return this.projectsRepo.save(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    if (project.ownerId !== userId)
      throw new ForbiddenException('Only owner can delete');
    await this.projectsRepo.deleteById(id);
  }

  async addMember(
    projectId: string,
    memberId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(projectId, userId);
    if (project.ownerId !== userId)
      throw new ForbiddenException('Only owner can add members');
    if (!project.memberIds.includes(memberId)) {
      project.memberIds.push(memberId);
      project.updatedAt = new Date().toISOString();
      return this.projectsRepo.save(project);
    }
    return project;
  }
}
