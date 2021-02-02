import { Task } from './task.entity';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @GetUser() user: User,
        @Query(new ValidationPipe({exceptionFactory: (errors) => new BadRequestException(errors)})) getTasksFilterDto: GetTasksFilterDto
    ) {
       return this.tasksService.getTasks(getTasksFilterDto, user);
    }

    @Post()
    @UsePipes(new ValidationPipe({
        exceptionFactory: (errors) => new BadRequestException(errors),
    }))
    createTask(
        @Body() CreateTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.createTask(CreateTaskDto, user);
    }

    @Get('/:id')
    getTaskById(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id: number
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe
    ) status: TaskStatus):Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    @Delete('/:id')
    @HttpCode(204)
    deleteTask(
        @GetUser() user: User,
        @Param('id', ParseIntPipe
    ) id: number): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }
}
