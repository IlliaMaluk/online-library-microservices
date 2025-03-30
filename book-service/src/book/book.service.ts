import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {}

    async createBook(data: Partial<Book>): Promise<Book> {
        const book = this.bookRepository.create(data);
        return await this.bookRepository.save(book);
    }

    async updateBook(id: string, updateData: Partial<Book>): Promise<Book> {
        const result = await this.bookRepository.update(id, updateData);
        if (result.affected === 0) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }
        return this.getBook(id);
    }

    async getBook(id: string): Promise<Book> {
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }
        return book;
    }

    async getBooks(filter: Partial<Book>): Promise<Book[]> {
        const query: any = {};
        if (filter.genre) query.genre = filter.genre;
        if (filter.author) query.author = filter.author;
        if (filter.publication_year) query.publication_year = filter.publication_year;
        return this.bookRepository.find({ where: query });
    }

    async deleteBook(id: string): Promise<void> {
        const result = await this.bookRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }
    }
}
