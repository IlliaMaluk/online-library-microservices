import {Controller, Get, Post, Put, Param, Body, Delete, UseGuards} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {AuthGuard} from "../auth/auth.guard";


@UseGuards(AuthGuard)
@Controller('reading-progress')
export class ReadingGatewayController {
  constructor(private readonly httpService: HttpService) {}

  private readonly readingServiceUrl = 'http://localhost:3002';

  @Post()
  async create(@Body() dto: any) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.readingServiceUrl}/reading-progress`, dto)
    );
    return data;
  }

  @Get(':userId')
  async getProgress(@Param('userId') userId: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.readingServiceUrl}/reading-progress/${userId}`)
    );
    return data;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    const { data } = await firstValueFrom(
      this.httpService.put(`${this.readingServiceUrl}/reading-progress/${id}`, dto)
    );
    return data;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`${this.readingServiceUrl}/reading-progress/${id}`)
    );
    return data;
  }
}