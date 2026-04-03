import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IProjectsRepository, ITasksRepository } from '../common/repositories';
import { Task, TaskFilters, TaskStatus, TaskPriority } from '../common/interfaces';
import { CreateTaskDto, TaskFiltersDto, UpdateTaskDto, UpdateTaskStatusDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepo: ITasksRepository,
    private readonly projectsRepo: IProjectsRepository,
  ) {}

  private async assertMember(projectId: string, userId: string) {
    const project = await this.projectsRepo.findById(projectId);
    if (!project) throw new NotFoundException('Project not found');
    if (!project.memberIds.includes(userId))
      throw new ForbiddenException('Access denied');
    return project;
  }

  async create(
    projectId: string,
    dto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    await this.assertMember(projectId, userId);
    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      projectId,
      title: dto.title,
      description: dto.description,
      status: TaskStatus.TODO,
      priority: dto.priority ?? TaskPriority.MEDIUM,
      assigneeId: dto.assigneeId,
      reporterId: userId,
      dueDate: dto.dueDate,
      epicId: dto.epicId,
      storyPoints: dto.storyPoints,
      createdAt: now,
      updatedAt: now,
    };
    return this.tasksRepo.save(task);
  }

  async findAll(
    projectId: string,
    filters: TaskFiltersDto,
    userId: string,
  ): Promise<Task[]> {
    await this.assertMember(projectId, userId);
    const taskFilters: TaskFilters = { projectId, ...filters };
    return this.tasksRepo.findAllWithFilters(taskFilters);
  }

  async findOne(taskId: string, userId: string): Promise<Task> {
    const task = await this.tasksRepo.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    await this.assertMember(task.projectId, userId);
    return task;
  }

  async update(
    taskId: string,
    dto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(taskId, userId);
    const updated: Task = {
      ...task,
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.assigneeId !== undefined && { assigneeId: dto.assigneeId }),
      ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
      ...(dto.epicId !== undefined && { epicId: dto.epicId }),
      ...(dto.storyPoints !== undefined && { storyPoints: dto.storyPoints }),
      updatedAt: new Date().toISOString(),
    };
    return this.tasksRepo.save(updated);
  }

  async updateStatus(
    taskId: string,
    dto: UpdateTaskStatusDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(taskId, userId);
    const updated: Task = {
      ...task,
      status: dto.status,
      updatedAt: new Date().toISOString(),
    };
    return this.tasksRepo.save(updated);
  }

  async remove(taskId: string, userId: string): Promise<void> {
    await this.findOne(taskId, userId);
    await this.tasksRepo.deleteById(taskId);
  }
}
