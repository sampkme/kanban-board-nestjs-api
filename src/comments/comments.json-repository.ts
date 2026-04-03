import * as path from 'path';
import { ICommentsRepository } from '../common/repositories';
import { Comment } from '../common/interfaces';
import { JsonFileStore } from '../common/store/json-file.store';

export class CommentsJsonRepository implements ICommentsRepository {
  private readonly store: JsonFileStore<Comment>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<Comment>(
      path.join(dataDir, 'comments.json'),
    );
  }

  async findById(id: string): Promise<Comment | undefined> {
    return this.store.findById(id);
  }

  async findByTaskId(taskId: string): Promise<Comment[]> {
    return this.store.readAll().filter((c) => c.taskId === taskId);
  }

  async save(comment: Comment): Promise<Comment> {
    return this.store.save(comment);
  }

  async deleteById(id: string): Promise<boolean> {
    return this.store.deleteById(id);
  }
}
