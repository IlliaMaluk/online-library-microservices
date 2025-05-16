import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class BookService {
    constructor(
      @InjectRepository(Book)
      private readonly bookRepository: Repository<Book>,
    ) {}

    async createBook(data: Partial<Book>): Promise<Book> {
        if (data.file_url && this.isExternalUrl(data.file_url)) {
            const filename = this.generateFilename(data.title ?? 'book');
            await this.downloadPDF(data.file_url, filename);
            data.file_url = `/books/${filename}`;
        }

        const book = this.bookRepository.create(data);
        return await this.bookRepository.save(book);
    }

    async updateBook(id: string, updateData: Partial<Book>): Promise<Book> {
        if (updateData.file_url && this.isExternalUrl(updateData.file_url)) {
            const filename = this.generateFilename(updateData.title ?? 'book');
            await this.downloadPDF(updateData.file_url, filename);
            updateData.file_url = `/books/${filename}`;
        }

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

    private isExternalUrl(url: string): boolean {
        return url.startsWith('http') && !url.includes('localhost') && !url.startsWith('/books/');
    }

    private generateFilename(title: string): string {
        const slug = title.toLowerCase().replace(/[^a-z0-9]/gi, '_');
        const timestamp = Date.now();
        return `${slug}_${timestamp}.pdf`;
    }

    private async downloadPDF(url: string, filename: string): Promise<void> {
        const targetDir = path.resolve(__dirname, '..', '..', '..', '..', 'online-library-front', 'public', 'books');
        const filePath = path.join(targetDir, filename);

        console.log(`Downloading pdf from ${url}`);
        console.log(`Saving to: ${filePath}`);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            console.log('Folder created!');
        }

        const writer = fs.createWriteStream(filePath);

        try {
            const response = await axios.get(url, { responseType: 'stream' });

            console.log(`Status: ${response.status} | Headers:`, response.headers);

            return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                writer.on('finish', () => {
                    console.log('File downloaded successfully.');
                    resolve();
                });
                writer.on('error', (err) => {
                    console.error('Error while writing file:', err.message);
                    reject(err);
                });
            });
        } catch (err) {
            console.error('Error while loading PDF:', err.message);
            throw err;
        }
    }

    async deleteBook(id: string): Promise<void> {
        console.log('Deleting reading-progress by id: ', id);
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        if (book.file_url?.startsWith('/books/')) {
            const filePath = path.resolve(
              __dirname,
              '..', '..', '..', '..',
              'online-library-front',
              'public',
              book.file_url.replace('/books/', 'books/')
            );

            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`File deleted: ${filePath}`);
                }
            } catch (err) {
                console.warn(`Can't find file: ${filePath}`, err.message);
            }
        }

        await this.bookRepository.delete(id);
    }
}
