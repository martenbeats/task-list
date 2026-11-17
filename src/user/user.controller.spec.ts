import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should forward the DTO to userService.create and return its result', async () => {
      const dto: CreateUserDto = { name: 'johndoe' } as CreateUserDto;
      const expected = {
        message: 'Usuario creado',
        createdUser: { id: 1, name: 'johndoe' },
      };
      mockUserService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(mockUserService.create).toHaveBeenCalledTimes(1);
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });

    it('should propagate errors from userService.create', async () => {
      const dto = { name: 'dupe' } as CreateUserDto;
      mockUserService.create.mockRejectedValue(new Error('Duplicate'));

      await expect(controller.create(dto)).rejects.toThrow('Duplicate');
    });
  });

  describe('findAll', () => {
    it('should call userService.findAll and return its result', async () => {
      const expected = { users: [{ id: 1, name: 'a' }] };
      mockUserService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
      expect(mockUserService.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should call userService.findOne with the id and return its result', async () => {
      const expected = { user: { id: 7, name: 'jane' } };
      mockUserService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(7);

      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith(7);
      expect(result).toEqual(expected);
    });

    it('should propagate errors from userService.findOne', async () => {
      mockUserService.findOne.mockRejectedValue(new Error('not found'));

      await expect(controller.findOne(999)).rejects.toThrow('not found');
      expect(mockUserService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should call userService.update with id and DTO, and return its result', async () => {
      const dto: UpdateUserDto = { name: 'newname' } as UpdateUserDto;
      const expected = { user: { id: 3, name: 'newname' } };
      mockUserService.update.mockResolvedValue(expected);

      const result = await controller.update(3, dto);

      expect(mockUserService.update).toHaveBeenCalledTimes(1);
      expect(mockUserService.update).toHaveBeenCalledWith(3, dto);
      expect(result).toEqual(expected);
    });

    it('should propagate errors from userService.update', async () => {
      mockUserService.update.mockRejectedValue(new Error('bad request'));

      await expect(controller.update(3, {} as UpdateUserDto)).rejects.toThrow(
        'bad request',
      );
    });
  });

  describe('remove', () => {
    it('should call userService.remove with the id and return its result', async () => {
      const expected = { message: 'Usuario eliminado' };
      mockUserService.remove.mockResolvedValue(expected);

      const result = await controller.remove(5);

      expect(mockUserService.remove).toHaveBeenCalledTimes(1);
      expect(mockUserService.remove).toHaveBeenCalledWith(5);
      expect(result).toEqual(expected);
    });

    it('should propagate errors from userService.remove', async () => {
      mockUserService.remove.mockRejectedValue(new Error('boom'));

      await expect(controller.remove(5)).rejects.toThrow('boom');
    });
  });
});