import { Task } from './task.entity';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(new ValidationPipe({exceptionFactory: (errors) => new BadRequestException(errors)})) getTasksFilterDto: GetTasksFilterDto) {
       return this.tasksService.getTasks(getTasksFilterDto);
    }

    @Post()
    @UsePipes(new ValidationPipe({
        exceptionFactory: (errors) => new BadRequestException(errors),
    }))
    createTask(@Body() CreateTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(CreateTaskDto);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus):Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Delete('/:id')
    @HttpCode(204)
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.deleteTask(id);
    }
}
