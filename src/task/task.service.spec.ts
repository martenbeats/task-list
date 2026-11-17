import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service.js';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity.js';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TaskService', () => {
  let service: TaskService;
  let repo: Repository<Task>;

  const mockRepository = {
    save: vi.fn(),
    createQueryBuilder: vi.fn(),
    findOne: vi.fn(),
    findOneBy: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, {
        provide: getRepositoryToken(Task),
        useValue: mockRepository,
      },],
    }).compile();

    service = module.get<TaskService>(TaskService);
     repo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto = { title: 'Test' } as any;
      const savedTask = { id: 1, ...dto };
      mockRepository.save.mockResolvedValue(savedTask);

      const result = await service.create(dto);

      expect(mockRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Tarea creada',
        createdTask: savedTask,
      });
    });
  });
});
