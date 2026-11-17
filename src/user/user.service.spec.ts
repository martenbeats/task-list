import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { UserService } from './user.service.js';
import { User } from './entities/user.entity.js';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  const mockRepository = {
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneBy: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the user wrapped in an object when it exists', async () => {
      const user = { id: 1, name: 'johndoe' } as User;
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual({ user });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when the user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'El usuario no existe',
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('should query with the exact id passed in', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 42 } as User);

      await service.findOne(42);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 42 },
      });
    });
  });
});