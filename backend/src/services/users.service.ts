import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CryptoRepository } from '../repositories/crypto.repository';
import { CreateUserDto, UserDto } from '../validations/user';
import { EmailExistsException } from '../exceptions/user.exceptions';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueName } from '../configs';
import { MockKafkaClient } from '../messaging/mock.kafka.client';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('CryptoRepository')
    private readonly cryptoRepository: CryptoRepository,

    @InjectQueue(QueueName.greetingEmailQueue)
    private readonly greetingEmailQueue: Queue,

    @Inject('KafkaClient') private kafkaClient: MockKafkaClient,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto | null> {
    const existingUser = await this.userRepository.getByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new EmailExistsException();
    }

    const newUser = await this.userRepository
      .create(createUserDto)
      .then((user): UserDto => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      });

    await this.greetingEmailQueue.add('welcome', {
      id: newUser.id,
    });

    this.kafkaClient.emit('user.created', newUser);

    return newUser;
  }
}
