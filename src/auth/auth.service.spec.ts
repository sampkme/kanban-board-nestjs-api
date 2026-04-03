import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { IUsersRepository } from '../common/repositories';
import { User } from '../common/interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepo: jest.Mocked<IUsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 'user-1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    passwordHash: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeAll(async () => {
    mockUser.passwordHash = await bcrypt.hash('password123', 10);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: IUsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-jwt-token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepo = module.get(IUsersRepository);
    jwtService = module.get(JwtService);
  });

  describe('signup', () => {
    it('should create a user and return a JWT', async () => {
      usersRepo.findByEmail.mockResolvedValue(undefined);
      usersRepo.save.mockImplementation(async (u) => u);

      const result = await service.signup({
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(usersRepo.save).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'new@example.com' }),
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      usersRepo.findByEmail.mockResolvedValue(mockUser);
      await expect(
        service.signup({
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user for valid credentials', async () => {
      usersRepo.findByEmail.mockResolvedValue(mockUser);
      const result = await service.validateUser('john@example.com', 'password123');
      expect(result.id).toBe(mockUser.id);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      usersRepo.findByEmail.mockResolvedValue(mockUser);
      await expect(
        service.validateUser('john@example.com', 'wrong'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      usersRepo.findByEmail.mockResolvedValue(undefined);
      await expect(
        service.validateUser('nobody@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user without passwordHash', async () => {
      usersRepo.findById.mockResolvedValue(mockUser);
      const profile = await service.getProfile('user-1');
      expect(profile).not.toHaveProperty('passwordHash');
      expect(profile.email).toBe('john@example.com');
    });
  });
});
