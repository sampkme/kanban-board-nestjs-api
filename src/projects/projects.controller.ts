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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './projects.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.create(dto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List projects for current user' })
  findAll(@CurrentUser() user: RequestUser) {
    return this.projectsService.findAllForUser(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project' })
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.projectsService.findOne(id, user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.update(id, dto, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.projectsService.remove(id, user.userId);
  }

  @Post(':id/members/:memberId')
  @ApiOperation({ summary: 'Add a member to a project' })
  addMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.addMember(id, memberId, user.userId);
  }
}
