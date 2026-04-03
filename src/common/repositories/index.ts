import { Comment, Epic, Project, Task, TaskFilters, User } from '../interfaces';

export abstract class IUsersRepository {
  abstract findById(id: string): Promise<User | undefined>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract save(user: User): Promise<User>;
  abstract deleteById(id: string): Promise<boolean>;
  abstract findAll(): Promise<User[]>;
}

export abstract class IProjectsRepository {
  abstract findById(id: string): Promise<Project | undefined>;
  abstract findAll(): Promise<Project[]>;
  abstract findByMemberId(userId: string): Promise<Project[]>;
  abstract save(project: Project): Promise<Project>;
  abstract deleteById(id: string): Promise<boolean>;
}

export abstract class ITasksRepository {
  abstract findById(id: string): Promise<Task | undefined>;
  abstract findByProjectId(projectId: string): Promise<Task[]>;
  abstract findAllWithFilters(filters: TaskFilters): Promise<Task[]>;
  abstract save(task: Task): Promise<Task>;
  abstract deleteById(id: string): Promise<boolean>;
}

export abstract class ICommentsRepository {
  abstract findById(id: string): Promise<Comment | undefined>;
  abstract findByTaskId(taskId: string): Promise<Comment[]>;
  abstract save(comment: Comment): Promise<Comment>;
  abstract deleteById(id: string): Promise<boolean>;
}

export abstract class IEpicsRepository {
  abstract findById(id: string): Promise<Epic | undefined>;
  abstract findByProjectId(projectId: string): Promise<Epic[]>;
  abstract save(epic: Epic): Promise<Epic>;
  abstract deleteById(id: string): Promise<boolean>;
}
