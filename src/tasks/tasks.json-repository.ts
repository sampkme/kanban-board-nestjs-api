import * as path from 'path';
import { ITasksRepository } from '../common/repositories';
import { Task, TaskFilters } from '../common/interfaces';
import { JsonFileStore } from '../common/store/json-file.store';

export class TasksJsonRepository implements ITasksRepository {
  private readonly store: JsonFileStore<Task>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<Task>(path.join(dataDir, 'tasks.json'));
  }

  async findById(id: string): Promise<Task | undefined> {
    return this.store.findById(id);
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    return this.store.readAll().filter((t) => t.projectId === projectId);
  }

  async findAllWithFilters(filters: TaskFilters): Promise<Task[]> {
    let tasks = this.store.readAll();

    if (filters.projectId) {
      tasks = tasks.filter((t) => t.projectId === filters.projectId);
    }

    if (filters.status) {
      tasks = tasks.filter((t) => t.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(q));
    }

    if (filters.assigneeId) {
      tasks = tasks.filter((t) => t.assigneeId === filters.assigneeId);
    }

    return tasks;
  }

  async save(task: Task): Promise<Task> {
    return this.store.save(task);
  }

  async deleteById(id: string): Promise<boolean> {
    return this.store.deleteById(id);
  }
}
