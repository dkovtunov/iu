import { ClientProxy } from '@nestjs/microservices/client/client-proxy';

export type MockKafkaClient = Pick<ClientProxy, 'emit'>;
