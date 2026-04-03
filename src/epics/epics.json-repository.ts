import * as path from 'path';
import { IEpicsRepository } from '../common/repositories';
import { Epic } from '../common/interfaces';
import { JsonFileStore } from '../common/store/json-file.store';

export class EpicsJsonRepository implements IEpicsRepository {
  private readonly store: JsonFileStore<Epic>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<Epic>(path.join(dataDir, 'epics.json'));
  }

  async findById(id: string): Promise<Epic | undefined> {
    return this.store.findById(id);
  }

  async findByProjectId(projectId: string): Promise<Epic[]> {
    return this.store.readAll().filter((e) => e.projectId === projectId);
  }

  async save(epic: Epic): Promise<Epic> {
    return this.store.save(epic);
  }

  async deleteById(id: string): Promise<boolean> {
    return this.store.deleteById(id);
  }
}
