import { Repository } from 'typeorm';
import { Book } from './book.entity';
export declare class BookService {
    private readonly bookRepository;
    constructor(bookRepository: Repository<Book>);
    createBook(data: Partial<Book>): Promise<Book>;
    updateBook(id: string, updateData: Partial<Book>): Promise<Book>;
    getBook(id: string): Promise<Book>;
    getBooks(filter: Partial<Book>): Promise<Book[]>;
    deleteBook(id: string): Promise<void>;
}
