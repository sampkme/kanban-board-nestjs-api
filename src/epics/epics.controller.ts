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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../auth/jwt.strategy';
import { EpicsService } from './epics.service';
import { CreateEpicDto, UpdateEpicDto } from './epics.dto';

@ApiTags('Epics')
@ApiBearerAuth()
@Controller('projects/:projectId/epics')
export class EpicsController {
  constructor(private readonly epicsService: EpicsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an epic in a project' })
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateEpicDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.epicsService.create(projectId, dto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List epics for a project' })
  findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.epicsService.findAll(projectId, user.userId);
  }

  @Patch(':epicId')
  @ApiOperation({ summary: 'Update an epic' })
  update(
    @Param('epicId') epicId: string,
    @Body() dto: UpdateEpicDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.epicsService.update(epicId, dto, user.userId);
  }

  @Delete(':epicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an epic' })
  remove(
    @Param('epicId') epicId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.epicsService.remove(epicId, user.userId);
  }
}
