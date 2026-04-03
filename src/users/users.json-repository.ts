import * as path from 'path';
import { IUsersRepository } from '../common/repositories';
import { User } from '../common/interfaces';
import { JsonFileStore } from '../common/store/json-file.store';

export class UsersJsonRepository implements IUsersRepository {
  private readonly store: JsonFileStore<User>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<User>(path.join(dataDir, 'users.json'));
  }

  async findById(id: string): Promise<User | undefined> {
    return this.store.findById(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.store.readAll().find((u) => u.email === email);
  }

  async save(user: User): Promise<User> {
    return this.store.save(user);
  }

  async deleteById(id: string): Promise<boolean> {
    return this.store.deleteById(id);
  }

  async findAll(): Promise<User[]> {
    return this.store.readAll();
  }
}
