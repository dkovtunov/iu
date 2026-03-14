import { Inject, Injectable } from '@nestjs/common';
import { MockKafkaClient } from './mock.kafka.client';
import { Observable } from 'rxjs';
import { LoggerService } from '@nestjs/common/services/logger.service';

@Injectable()
export class MockKafkaClientImpl implements MockKafkaClient {
  constructor(
    @Inject('LoggerService') private readonly logger: LoggerService,
  ) {}
  emit<TResult = any, TInput = any>(
    pattern: any,
    data: TInput,
  ): Observable<TResult> {
    this.logger.log('Emitting message to Kafka', pattern, data);

    return new Observable((subscriber) => {
      subscriber.next();
    });
  }
}

export const MockKafkaClientProvider = {
  provide: 'KafkaClient',
  useClass: MockKafkaClientImpl,
};
