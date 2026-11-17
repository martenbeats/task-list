import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserService {

  logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private readonly repo: Repository<User>,) { }

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.repo.save(createUserDto);
    return { message: 'Usuario creado', createdUser: createdUser };
  }

  async findAll() {
    const users = await this.repo.find();

    return { users: users };
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException(`El usuario no existe`);
    }
    return { user: user };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.repo.update(id, updateUserDto);
      const user = await this.repo.findOneBy({ id: id });
      return { user: user };
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
