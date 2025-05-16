import { BookService } from './book.service';
import { Book } from './book.entity';
export declare class BookController {
    private readonly bookService;
    constructor(bookService: BookService);
    createBook(data: Partial<Book>): Promise<Book>;
    updateBook(data: {
        id: string;
        update: Partial<Book>;
    }): Promise<Book>;
    getBook(data: {
        id: string;
    }): Promise<Book>;
    getBooks(data: Partial<Book>): Promise<Book[]>;
    deleteBook(data: {
        id: string;
    }): Promise<{
        status: string;
    }>;
}
