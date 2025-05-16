import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
      queue: 'api_gateway_queue',
      queueOptions: { durable: false },
    },
  });

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials: true,
  });

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('API Gateway is running on http://localhost:3000');
}

bootstrap();