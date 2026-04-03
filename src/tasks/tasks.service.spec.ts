import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITasksRepository, IProjectsRepository } from '../common/repositories';
import { Task, TaskStatus, TaskPriority, Project } from '../common/interfaces';

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepo: jest.Mocked<ITasksRepository>;
  let projectsRepo: jest.Mocked<IProjectsRepository>;

  const userId = 'user-1';
  const projectId = 'project-1';

  const mockProject: Project = {
    id: projectId,
    name: 'Test Project',
    ownerId: userId,
    memberIds: [userId],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockTask: Task = {
    id: 'task-1',
    projectId,
    title: 'Test Task',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    reporterId: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: ITasksRepository,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
            findAllWithFilters: jest.fn(),
            save: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        {
          provide: IProjectsRepository,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
            findByMemberId: jest.fn(),
            save: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    tasksRepo = module.get(ITasksRepository);
    projectsRepo = module.get(IProjectsRepository);
  });

  describe('create', () => {
    it('should create a task for a valid project member', async () => {
      projectsRepo.findById.mockResolvedValue(mockProject);
      tasksRepo.save.mockImplementation(async (t) => t);

      const result = await service.create(
        projectId,
        { title: 'New Task' },
        userId,
      );

      expect(result.title).toBe('New Task');
      expect(result.status).toBe(TaskStatus.TODO);
      expect(result.projectId).toBe(projectId);
      expect(result.reporterId).toBe(userId);
      expect(tasksRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException for non-members', async () => {
      projectsRepo.findById.mockResolvedValue(mockProject);
      await expect(
        service.create(projectId, { title: 'x' }, 'stranger'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException for non-existent project', async () => {
      projectsRepo.findById.mockResolvedValue(undefined);
      await expect(
        service.create('bad-id', { title: 'x' }, userId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return filtered tasks', async () => {
      projectsRepo.findById.mockResolvedValue(mockProject);
      tasksRepo.findAllWithFilters.mockResolvedValue([mockTask]);

      const result = await service.findAll(projectId, {}, userId);
      expect(result).toHaveLength(1);
      expect(tasksRepo.findAllWithFilters).toHaveBeenCalledWith(
        expect.objectContaining({ projectId }),
      );
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      tasksRepo.findById.mockResolvedValue(mockTask);
      projectsRepo.findById.mockResolvedValue(mockProject);
      tasksRepo.save.mockImplementation(async (t) => t);

      const result = await service.updateStatus(
        'task-1',
        { status: TaskStatus.IN_PROGRESS },
        userId,
      );

      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should throw NotFoundException for non-existent task', async () => {
      tasksRepo.findById.mockResolvedValue(undefined);
      await expect(
        service.updateStatus('bad', { status: TaskStatus.DONE }, userId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      tasksRepo.findById.mockResolvedValue(mockTask);
      projectsRepo.findById.mockResolvedValue(mockProject);
      tasksRepo.deleteById.mockResolvedValue(undefined);

      await service.remove('task-1', userId);
      expect(tasksRepo.deleteById).toHaveBeenCalledWith('task-1');
    });
  });
});
