import * as fs from 'fs';
import * as path from 'path';

export class JsonFileStore<T extends { id: string }> {
  private readonly filePath: string;
  private readonly tmpPath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.tmpPath = `${filePath}.tmp`;
    this.ensureFile();
  }

  private ensureFile(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf8');
    }
  }

  readAll(): T[] {
    const raw = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(raw) as T[];
  }

  writeAll(items: T[]): void {
    fs.writeFileSync(this.tmpPath, JSON.stringify(items, null, 2), 'utf8');
    fs.renameSync(this.tmpPath, this.filePath);
  }

  findById(id: string): T | undefined {
    return this.readAll().find((item) => item.id === id);
  }

  save(item: T): T {
    const items = this.readAll();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx === -1) {
      items.push(item);
    } else {
      items[idx] = item;
    }
    this.writeAll(items);
    return item;
  }

  deleteById(id: string): boolean {
    const items = this.readAll();
    const next = items.filter((i) => i.id !== id);
    if (next.length === items.length) return false;
    this.writeAll(next);
    return true;
  }
}
