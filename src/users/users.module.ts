import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersJsonRepository } from './users.json-repository';
import { IUsersRepository } from '../common/repositories';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: IUsersRepository,
      useFactory: (config: ConfigService) =>
        new UsersJsonRepository(config.get<string>('dataDir')!),
      inject: [ConfigService],
    },
  ],
  exports: [UsersService, IUsersRepository],
})
export class UsersModule {}
