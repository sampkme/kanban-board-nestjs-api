import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsJsonRepository } from './comments.json-repository';
import { ICommentsRepository } from '../common/repositories';
import { TasksModule } from '../tasks/tasks.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ConfigModule, TasksModule, ProjectsModule],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: ICommentsRepository,
      useFactory: (config: ConfigService) =>
        new CommentsJsonRepository(config.get<string>('dataDir')!),
      inject: [ConfigService],
    },
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
