import { Controller, Post, Get, Put, Param, Body, Delete } from '@nestjs/common';
import { ReadingService } from './reading.service';
import { CreateReadingProgressDto } from './dto/create-reading-progress.dto';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';
import { ReadingProgress } from './entities/reading-progress.entity';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('reading-progress')
export class ReadingController {
  constructor(private readonly readingService: ReadingService) {}

  @Post()
  create(@Body() createDto: CreateReadingProgressDto): Promise<ReadingProgress> {
    return this.readingService.create(createDto);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string): Promise<ReadingProgress[]> {
    return this.readingService.findByUser(userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateReadingProgressDto,
  ): Promise<ReadingProgress> {
    return this.readingService.update(id, updateDto);
  }

  @EventPattern('reading.created')
  async handleReadingCreated(@Payload() data: any) {
    console.log('Received reading.created:', data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    console.log('Deleting reading progress: ', id);
    await this.readingService.delete(id);
    return { deleted: true };
  }
}
