import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller.js';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;
  const mockTaskService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findAllByStatus: vi.fn(),
    findAllByUserId: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('create', () => {
    it('should call taskService.create with the DTO and return its result', async () => {
      const dto: CreateTaskDto = {
        title: 'Write tests',
        description: 'Cover the create endpoint',
      } as CreateTaskDto;

      const expected = {
        message: 'Tarea creada',
        createdTask: { id: 1, ...dto },
      };

      mockTaskService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      // Service was called once, with exactly the DTO
      expect(mockTaskService.create).toHaveBeenCalledTimes(1);
      expect(mockTaskService.create).toHaveBeenCalledWith(dto);

      // Controller returns whatever the service returned (no transformation)
      expect(result).toEqual(expected);
    });

    it('should propagate errors thrown by the service', async () => {
      const dto = { title: 'Broken' } as CreateTaskDto;
      const error = new Error('DB down');

      mockTaskService.create.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toThrow('DB down');
      expect(mockTaskService.create).toHaveBeenCalledWith(dto);
    });
  });
});
