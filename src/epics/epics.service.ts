import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IEpicsRepository, IProjectsRepository } from '../common/repositories';
import { Epic } from '../common/interfaces';
import { CreateEpicDto, UpdateEpicDto } from './epics.dto';

const DEFAULT_COLORS = [
  '#4186f4', '#9747ff', '#12b066', '#f59e0b', '#ef4444', '#06b6d4',
];

@Injectable()
export class EpicsService {
  constructor(
    private readonly epicsRepo: IEpicsRepository,
    private readonly projectsRepo: IProjectsRepository,
  ) {}

  private async assertMember(projectId: string, userId: string) {
    const project = await this.projectsRepo.findById(projectId);
    if (!project) throw new NotFoundException('Project not found');
    if (!project.memberIds.includes(userId))
      throw new ForbiddenException('Access denied');
    return project;
  }

  async create(projectId: string, dto: CreateEpicDto, userId: string): Promise<Epic> {
    await this.assertMember(projectId, userId);
    const existing = await this.epicsRepo.findByProjectId(projectId);
    const now = new Date().toISOString();
    const epic: Epic = {
      id: randomUUID(),
      projectId,
      name: dto.name,
      description: dto.description,
      color: dto.color ?? DEFAULT_COLORS[existing.length % DEFAULT_COLORS.length],
      createdAt: now,
      updatedAt: now,
    };
    return this.epicsRepo.save(epic);
  }

  async findAll(projectId: string, userId: string): Promise<Epic[]> {
    await this.assertMember(projectId, userId);
    return this.epicsRepo.findByProjectId(projectId);
  }

  async update(
    epicId: string,
    dto: UpdateEpicDto,
    userId: string,
  ): Promise<Epic> {
    const epic = await this.epicsRepo.findById(epicId);
    if (!epic) throw new NotFoundException('Epic not found');
    await this.assertMember(epic.projectId, userId);
    const updated: Epic = {
      ...epic,
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.color !== undefined && { color: dto.color }),
      updatedAt: new Date().toISOString(),
    };
    return this.epicsRepo.save(updated);
  }

  async remove(epicId: string, userId: string): Promise<void> {
    const epic = await this.epicsRepo.findById(epicId);
    if (!epic) throw new NotFoundException('Epic not found');
    await this.assertMember(epic.projectId, userId);
    await this.epicsRepo.deleteById(epicId);
  }
}
