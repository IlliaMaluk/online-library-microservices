"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("./book.entity");
const fs = require("fs");
const path = require("path");
const axios_1 = require("axios");
let BookService = class BookService {
    bookRepository;
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async createBook(data) {
        if (data.file_url && this.isExternalUrl(data.file_url)) {
            const filename = this.generateFilename(data.title ?? 'book');
            await this.downloadPDF(data.file_url, filename);
            data.file_url = `/books/${filename}`;
        }
        const book = this.bookRepository.create(data);
        return await this.bookRepository.save(book);
    }
    async updateBook(id, updateData) {
        if (updateData.file_url && this.isExternalUrl(updateData.file_url)) {
            const filename = this.generateFilename(updateData.title ?? 'book');
            await this.downloadPDF(updateData.file_url, filename);
            updateData.file_url = `/books/${filename}`;
        }
        const result = await this.bookRepository.update(id, updateData);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Book with id ${id} not found`);
        }
        return this.getBook(id);
    }
    async getBook(id) {
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new common_1.NotFoundException(`Book with id ${id} not found`);
        }
        return book;
    }
    async getBooks(filter) {
        const query = {};
        if (filter.genre)
            query.genre = filter.genre;
        if (filter.author)
            query.author = filter.author;
        if (filter.publication_year)
            query.publication_year = filter.publication_year;
        return this.bookRepository.find({ where: query });
    }
    isExternalUrl(url) {
        return url.startsWith('http') && !url.includes('localhost') && !url.startsWith('/books/');
    }
    generateFilename(title) {
        const slug = title.toLowerCase().replace(/[^a-z0-9]/gi, '_');
        const timestamp = Date.now();
        return `${slug}_${timestamp}.pdf`;
    }
    async downloadPDF(url, filename) {
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
            const response = await axios_1.default.get(url, { responseType: 'stream' });
            console.log(`📦 Status: ${response.status} | Headers:`, response.headers);
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
        }
        catch (err) {
            console.error('Error while loading PDF:', err.message);
            throw err;
        }
    }
    async deleteBook(id) {
        console.log('Deleting reading-progress by id: ', id);
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new common_1.NotFoundException(`Book with id ${id} not found`);
        }
        if (book.file_url?.startsWith('/books/')) {
            const filePath = path.resolve(__dirname, '..', '..', '..', '..', 'online-library-front', 'public', book.file_url.replace('/books/', 'books/'));
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`File deleted: ${filePath}`);
                }
            }
            catch (err) {
                console.warn(`Can't find file: ${filePath}`, err.message);
            }
        }
        await this.bookRepository.delete(id);
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookService);
//# sourceMappingURL=book.service.js.map