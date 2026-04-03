import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsJsonRepository } from './projects.json-repository';
import { IProjectsRepository } from '../common/repositories';

@Module({
  imports: [ConfigModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    {
      provide: IProjectsRepository,
      useFactory: (config: ConfigService) =>
        new ProjectsJsonRepository(config.get<string>('dataDir')!),
      inject: [ConfigService],
    },
  ],
  exports: [ProjectsService, IProjectsRepository],
})
export class ProjectsModule {}
