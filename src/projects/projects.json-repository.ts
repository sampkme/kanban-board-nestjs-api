import * as path from 'path';
import { IProjectsRepository } from '../common/repositories';
import { Project } from '../common/interfaces';
import { JsonFileStore } from '../common/store/json-file.store';

export class ProjectsJsonRepository implements IProjectsRepository {
  private readonly store: JsonFileStore<Project>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<Project>(
      path.join(dataDir, 'projects.json'),
    );
  }

  async findById(id: string): Promise<Project | undefined> {
    return this.store.findById(id);
  }

  async findAll(): Promise<Project[]> {
    return this.store.readAll();
  }

  async findByMemberId(userId: string): Promise<Project[]> {
    return this.store
      .readAll()
      .filter(
        (p) => p.ownerId === userId || p.memberIds.includes(userId),
      );
  }

  async save(project: Project): Promise<Project> {
    return this.store.save(project);
  }

  async deleteById(id: string): Promise<boolean> {
    return this.store.deleteById(id);
  }
}
