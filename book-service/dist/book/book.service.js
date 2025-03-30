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
let BookService = class BookService {
    bookRepository;
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async createBook(data) {
        const book = this.bookRepository.create(data);
        return await this.bookRepository.save(book);
    }
    async updateBook(id, updateData) {
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
    async deleteBook(id) {
        const result = await this.bookRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Book with id ${id} not found`);
        }
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookService);
//# sourceMappingURL=book.service.js.map