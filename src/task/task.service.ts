import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusType } from '../core/enums.js';

@Injectable()
export class TaskService {
  logger = new Logger(TaskService.name);

  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>,) { }

  async create(createTaskDto: CreateTaskDto) {
    const createdTask = await this.repo.save(createTaskDto);
    return { message: 'Tarea creada', createdTask: createdTask };
  }

  async findAll(limit: number, offset: number) {
    const tasks = await this.repo.createQueryBuilder("task").limit(limit).offset(offset).getMany();
    return { tasks: tasks }
  }

  async findAllByStatus(status: StatusType, limit: number, offset: number) {
    const tasks = await this.repo.createQueryBuilder("task")
      .where("task.status = :status", { status: status }).limit(limit).offset(offset).getMany();
    return { tasks: tasks }
  }

  async findAllByUserId(userId: number, limit: number, offset: number) {
    this.logger.log(userId)
    const tasks = await this.repo.createQueryBuilder("task").where("task.userId = :userId", { userId: userId }).limit(limit).offset(offset).getMany();
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
      return { message: 'Tarea actualizada', task: task };
    } catch (error: any) {
      this.logger.error(error);
      return { message: `Error al actualizar tarea: ${error.detail}` };
    }
  }

  async remove(id: number) {
    try {
      const result = await this.repo.delete({ id: id });

      if (result.affected === 0) throw new NotFoundException(`La tarea no existe`);
      return { message: `Tarea eliminada` };
    } catch (error: any) {
      this.logger.error(error);
      return { message: `Error al eliminar tarea: ${error.detail}` };
    }
  }
}
