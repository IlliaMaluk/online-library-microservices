import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('books')
export class BooksController {
    constructor(@Inject('BOOK_SERVICE') private readonly bookServiceClient: ClientProxy) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    async createBook(@Body() data: any) {
        return firstValueFrom(this.bookServiceClient.send({ cmd: 'create_book' }, data));
    }

    @Put(':id')
    async updateBook(@Param('id') id: string, @Body() update: any) {
        return firstValueFrom(this.bookServiceClient.send({ cmd: 'update_book' }, { id, update }));
    }

    @Get(':id')
    async getBook(@Param('id') id: string) {
        return firstValueFrom(this.bookServiceClient.send({ cmd: 'get_book' }, { id }));
    }

    @Get()
    async getBooks(@Query() query: any) {
        return firstValueFrom(this.bookServiceClient.send({ cmd: 'get_books' }, query));
    }

    @Delete(':id')
    async deleteBook(@Param('id') id: string) {
        return firstValueFrom(this.bookServiceClient.send({ cmd: 'delete_book' }, { id }));
    }
}
