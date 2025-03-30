import { ClientProxy } from '@nestjs/microservices';
export declare class BooksController {
    private readonly bookServiceClient;
    constructor(bookServiceClient: ClientProxy);
    createBook(data: any): Promise<any>;
    updateBook(id: string, update: any): Promise<any>;
    getBook(id: string): Promise<any>;
    getBooks(query: any): Promise<any>;
    deleteBook(id: string): Promise<any>;
}
