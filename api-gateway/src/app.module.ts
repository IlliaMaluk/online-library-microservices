import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { BooksController } from './books/books.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: 'user-service',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'BOOK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: 'book-service',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [UsersController, BooksController],
})
export class AppModule {}