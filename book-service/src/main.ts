import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'book-service',
      queueOptions: { durable: false },
    },
  });
  await app.listen();
  console.log('Book Service is running and connected to RabbitMQ');
}
bootstrap();
