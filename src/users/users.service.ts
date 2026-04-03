import { Injectable, NotFoundException } from '@nestjs/common';
import { IUsersRepository } from '../common/repositories';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: IUsersRepository) {}

  async findById(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async findAll() {
    const users = await this.usersRepo.findAll();
    return users.map(({ passwordHash: _p, ...rest }) => rest);
  }
}
