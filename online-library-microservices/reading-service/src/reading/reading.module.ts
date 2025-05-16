import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingController } from './reading.controller';
import { ReadingService } from './reading.service';
import { ReadingProgress } from './entities/reading-progress.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingProgress])],
  controllers: [ReadingController],
  providers: [ReadingService, RabbitMQService],
})
export class ReadingModule {}
