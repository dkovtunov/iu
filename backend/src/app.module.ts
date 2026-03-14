import { ConsoleLogger, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import {
  allBullQueues,
  bullConfig,
  databaseConfig,
  envConfig,
} from './configs';
import { UserEntity } from './entities/user.entity';
import { UserRepositoryProvider } from './repositories/user.repository.impl';
import { CryptoRepositoryProvider } from './repositories/crypto.repository.impl';
import { MockKafkaClientProvider } from './messaging/kafka.client.impl';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    BullModule.forRoot(bullConfig),
    BullModule.registerQueue(...allBullQueues),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'LoggerService',
      useClass: ConsoleLogger,
    },
    UserRepositoryProvider,
    CryptoRepositoryProvider,
    MockKafkaClientProvider,
  ],
})
export class AppModule {}
