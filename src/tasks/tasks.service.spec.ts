import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import {Test} from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';

const mockuser = {id: 10, username: 'psreepathi'};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
});

describe('TaskService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async ()=> {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TaskRepository, useFactory: mockTaskRepository}
            ],
        }).compile();
        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('get all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('some return value');
            expect(taskRepository.getTasks).not.toBeCalled();
            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'some search query'};
            const result = await tasksService.getTasks(filters, mockuser);
            expect(taskRepository.getTasks).toBeCalled();
            expect(result).toEqual('some return value');
        })
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const task = {title: 'First task', description: 'Creating my first task'}
            taskRepository.findOne.mockResolvedValue(task);
            expect(taskRepository.findOne).not.toBeCalled();
            const result = await tasksService.getTaskById(1, mockuser);
            expect(result).toEqual(task);
            expect(taskRepository.findOne).toBeCalledWith({where: {id: 1, userId: mockuser.id }});
        });

        it('throws NotFoundException', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockuser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('creates a task', async () => {
            const task = {title: 'First task', description: 'Creating my first task'};
            taskRepository.createTask.mockResolvedValue(task);
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskkDto: CreateTaskDto = task;
            const result = await tasksService.createTask(createTaskkDto, mockuser);
            expect(result).toEqual(task);
        })
    });

    describe('deleteTask', () => {
        it('deletes a task', async () => {
            taskRepository.delete.mockResolvedValue({affected: 1});
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(1, mockuser);
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockuser.id});
        });

        it('throws not found exception', async () => {
            taskRepository.delete.mockResolvedValue({affected: 0});
            expect(tasksService.deleteTask(1, mockuser)).rejects.toThrow(NotFoundException);
        })
    })
});