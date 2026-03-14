import { QueueOptions } from 'bullmq';
import { RegisterQueueOptions } from '@nestjs/bullmq';

export const bullConfig: QueueOptions = {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
};

export enum QueueName {
  greetingEmailQueue = 'greetingEmailQueue',
}

export const allBullQueues: RegisterQueueOptions[] = Object.values(
  QueueName,
).map((name) => ({
  name,
}));
