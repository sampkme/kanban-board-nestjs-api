import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ICommentsRepository,
  ITasksRepository,
  IProjectsRepository,
} from '../common/repositories';
import { Comment } from '../common/interfaces';
import { CreateCommentDto } from './comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepo: ICommentsRepository,
    private readonly tasksRepo: ITasksRepository,
    private readonly projectsRepo: IProjectsRepository,
  ) {}

  private async assertAccess(taskId: string, userId: string) {
    const task = await this.tasksRepo.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    const project = await this.projectsRepo.findById(task.projectId);
    if (!project) throw new NotFoundException('Project not found');
    if (!project.memberIds.includes(userId))
      throw new ForbiddenException('Access denied');
    return task;
  }

  async create(
    taskId: string,
    dto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    await this.assertAccess(taskId, userId);
    const now = new Date().toISOString();
    const comment: Comment = {
      id: randomUUID(),
      taskId,
      authorId: userId,
      content: dto.content,
      createdAt: now,
      updatedAt: now,
    };
    return this.commentsRepo.save(comment);
  }

  async findByTaskId(taskId: string, userId: string): Promise<Comment[]> {
    await this.assertAccess(taskId, userId);
    return this.commentsRepo.findByTaskId(taskId);
  }

  async remove(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsRepo.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId)
      throw new ForbiddenException('Only author can delete');
    await this.commentsRepo.deleteById(commentId);
  }
}
