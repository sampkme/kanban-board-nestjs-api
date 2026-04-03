import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority } from '../common/interfaces';

describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<TasksService>;

  const user = { userId: 'user-1', email: 'john@example.com' };

  const mockTask: Task = {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Test Task',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    reporterId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateStatus: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  it('should create a task', async () => {
    service.create.mockResolvedValue(mockTask);
    const result = await controller.create('project-1', { title: 'Test Task' }, user);
    expect(result.title).toBe('Test Task');
    expect(service.create).toHaveBeenCalledWith('project-1', { title: 'Test Task' }, 'user-1');
  });

  it('should list tasks with filters', async () => {
    service.findAll.mockResolvedValue([mockTask]);
    const result = await controller.findAll('project-1', {}, user);
    expect(result).toHaveLength(1);
    expect(service.findAll).toHaveBeenCalledWith('project-1', {}, 'user-1');
  });

  it('should get a single task', async () => {
    service.findOne.mockResolvedValue(mockTask);
    const result = await controller.findOne('task-1', user);
    expect(result.id).toBe('task-1');
  });

  it('should update task status', async () => {
    const updated = { ...mockTask, status: TaskStatus.DONE };
    service.updateStatus.mockResolvedValue(updated);
    const result = await controller.updateStatus(
      'task-1',
      { status: TaskStatus.DONE },
      user,
    );
    expect(result.status).toBe(TaskStatus.DONE);
  });

  it('should delete a task', async () => {
    service.remove.mockResolvedValue(undefined);
    await controller.remove('task-1', user);
    expect(service.remove).toHaveBeenCalledWith('task-1', 'user-1');
  });
});
