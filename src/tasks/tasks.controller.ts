import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../auth/jwt.strategy';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskFiltersDto, UpdateTaskDto, UpdateTaskStatusDto } from './tasks.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task in a project' })
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.create(projectId, dto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks with optional filters' })
  findAll(
    @Param('projectId') projectId: string,
    @Query() filters: TaskFiltersDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.findAll(projectId, filters, user.userId);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Get a single task' })
  findOne(
    @Param('taskId') taskId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.findOne(taskId, user.userId);
  }

  @Patch(':taskId')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.update(taskId, dto, user.userId);
  }

  @Patch(':taskId/status')
  @ApiOperation({ summary: 'Update task status' })
  updateStatus(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.updateStatus(taskId, dto, user.userId);
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  remove(
    @Param('taskId') taskId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.remove(taskId, user.userId);
  }
}
