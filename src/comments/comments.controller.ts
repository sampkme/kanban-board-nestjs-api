import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../auth/jwt.strategy';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './comments.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a comment to a task' })
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.commentsService.create(taskId, dto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a task' })
  findAll(
    @Param('taskId') taskId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.commentsService.findByTaskId(taskId, user.userId);
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  remove(
    @Param('commentId') commentId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.commentsService.remove(commentId, user.userId);
  }
}
