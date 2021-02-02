import { User } from './../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRespository: TaskRepository
    ) {}

    getTasks(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRespository.getTasks(getTasksFilterDto, user)
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
       return this.taskRespository.createTask(createTaskDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRespository.findOne({where: {id, userId: user.id}});

        if(!found){
            throw new NotFoundException(`Task with id "${id}" not found.`);
        }

        return found;
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRespository.delete({id, userId: user.id});
        
        if(result.affected === 0){
            throw new NotFoundException(`Task with "${id}" not found.`);
        }
    }
}
