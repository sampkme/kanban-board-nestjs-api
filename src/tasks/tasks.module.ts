import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksJsonRepository } from './tasks.json-repository';
import { ITasksRepository } from '../common/repositories';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ConfigModule, ProjectsModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: ITasksRepository,
      useFactory: (config: ConfigService) =>
        new TasksJsonRepository(config.get<string>('dataDir')!),
      inject: [ConfigService],
    },
  ],
  exports: [TasksService, ITasksRepository],
})
export class TasksModule {}
