import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
  logger = new Logger(TaskService.name);

  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>,) { }

  async create(createTaskDto: CreateTaskDto) {
    const createdTask = await this.repo.save(createTaskDto);
    return { message: 'Tarea creada', createdTask: createdTask };
  }

  async findAll() {
    const tasks = await this.repo.find();
    return { tasks: tasks }
  }

 async findOne(id: number) {
     const task = await this.repo.findOne({ where: { id: id } });
    
        if (!task) {
          throw new NotFoundException(`La tarea no existe`);
        }
        return { task: task };
  }

 async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      await this.repo.update(id, updateTaskDto);
      const task = await this.repo.findOneBy({ id: id });
      return { task: task };
    } catch (error: any) {
      this.logger.error(error);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.repo.delete({ id: id });

      if (result.affected === 0) return false;
      return true;
    } catch (error: any) {
      this.logger.error(error);
      return false;
    }
  }
}
