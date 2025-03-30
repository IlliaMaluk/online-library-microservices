import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookService } from './book.service';
import { Book } from './book.entity';

@Controller()
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @MessagePattern({ cmd: 'create_book' })
    async createBook(data: Partial<Book>) {
        return this.bookService.createBook(data);
    }

    @MessagePattern({ cmd: 'update_book' })
    async updateBook(data: { id: string; update: Partial<Book> }) {
        return this.bookService.updateBook(data.id, data.update);
    }

    @MessagePattern({ cmd: 'get_book' })
    async getBook(data: { id: string }) {
        return this.bookService.getBook(data.id);
    }

    @MessagePattern({ cmd: 'get_books' })
    async getBooks(data: Partial<Book>) {
        return this.bookService.getBooks(data);
    }

    @MessagePattern({ cmd: 'delete_book' })
    async deleteBook(data: { id: string }) {
        await this.bookService.deleteBook(data.id);
        return { status: 'success' };
    }
}
