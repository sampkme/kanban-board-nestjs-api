import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EpicsService } from './epics.service';
import { EpicsController } from './epics.controller';
import { EpicsJsonRepository } from './epics.json-repository';
import { IEpicsRepository } from '../common/repositories';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ConfigModule, ProjectsModule],
  controllers: [EpicsController],
  providers: [
    EpicsService,
    {
      provide: IEpicsRepository,
      useFactory: (config: ConfigService) =>
        new EpicsJsonRepository(config.get<string>('dataDir')!),
      inject: [ConfigService],
    },
  ],
  exports: [EpicsService, IEpicsRepository],
})
export class EpicsModule {}
