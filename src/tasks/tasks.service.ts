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

    getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRespository.getTasks(getTasksFilterDto)
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
       return this.taskRespository.createTask(createTaskDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRespository.findOne(id);

        if(!found){
            throw new NotFoundException(`Task with id "${id}" not found.`);
        }

        return found;
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRespository.delete(id);
        
        if(result.affected === 0){
            throw new NotFoundException(`Task with "${id}" not found.`);
        }
    }
}
