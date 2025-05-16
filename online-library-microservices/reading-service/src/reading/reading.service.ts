import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingProgress } from './entities/reading-progress.entity';
import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(ReadingProgress)
    private readonly repo: Repository<ReadingProgress>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async create(dto: CreateReadingProgressDto): Promise<ReadingProgress> {
    const existing = await this.repo.findOne({
      where: {
        user_id: dto.user_id,
        book_id: dto.book_id,
      }
    });

    if (existing) {
      return existing;
    }

    const reading = this.repo.create({
      ...dto,
      status: dto.percentage_read >= 100 ? 'completed' : 'in_progress',
    });

    const saved = await this.repo.save(reading);
    await this.rabbitMQService.emit('reading.created', saved);
    return saved;
  }

  async findByUser(userId: string): Promise<ReadingProgress[]> {
    return this.repo.find({ where: { user_id: userId } });
  }

  async update(id: string, dto: UpdateReadingProgressDto): Promise<ReadingProgress> {
    const updatedFields: Partial<ReadingProgress> = { ...dto };

    if (dto.percentage_read !== undefined && dto.percentage_read >= 100) {
      updatedFields.status = 'completed';
    }

    await this.repo.update(id, updatedFields);
    const updated = await this.repo.findOneBy({ id });
    if (!updated) {
      throw new Error('ReadingProgress not found');
    }

    await this.rabbitMQService.emit('reading.updated', updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException(`Progress with id ${id} not found`);
    await this.repo.delete(id);
  }

}
