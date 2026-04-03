import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { IUsersRepository } from '../common/repositories';
import { User } from '../common/interfaces';
import { SignupDto } from './auth.dto';

const AVATAR_COLORS = [
  '#4186f4', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12',
  '#1abc9c', '#e67e22', '#e91e63', '#009688', '#ff5722',
  '#607d8b', '#795548', '#673ab7', '#00bcd4', '#8bc34a',
];

function pickAvatarColor(allUsers: User[]): string {
  const usedColors = new Set(allUsers.map((u) => u.avatarColor));
  const available = AVATAR_COLORS.find((c) => !usedColors.has(c));
  return available ?? AVATAR_COLORS[allUsers.length % AVATAR_COLORS.length];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<{ accessToken: string }> {
    const existing = await this.usersRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const now = new Date().toISOString();
    const allUsers = await this.usersRepo.findAll();
    const user: User = {
      id: randomUUID(),
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: hashed,
      avatarColor: pickAvatarColor(allUsers),
      createdAt: now,
      updatedAt: now,
    };
    await this.usersRepo.save(user);
    return this.generateToken(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(user: User): Promise<{ accessToken: string }> {
    return this.generateToken(user);
  }

  async getProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...profile } = user;
    return profile;
  }

  private generateToken(user: User): { accessToken: string } {
    const payload = { sub: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
