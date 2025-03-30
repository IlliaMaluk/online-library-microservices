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
exports.BooksController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let BooksController = class BooksController {
    bookServiceClient;
    constructor(bookServiceClient) {
        this.bookServiceClient = bookServiceClient;
    }
    async createBook(data) {
        return (0, rxjs_1.firstValueFrom)(this.bookServiceClient.send({ cmd: 'create_book' }, data));
    }
    async updateBook(id, update) {
        return (0, rxjs_1.firstValueFrom)(this.bookServiceClient.send({ cmd: 'update_book' }, { id, update }));
    }
    async getBook(id) {
        return (0, rxjs_1.firstValueFrom)(this.bookServiceClient.send({ cmd: 'get_book' }, { id }));
    }
    async getBooks(query) {
        return (0, rxjs_1.firstValueFrom)(this.bookServiceClient.send({ cmd: 'get_books' }, query));
    }
    async deleteBook(id) {
        return (0, rxjs_1.firstValueFrom)(this.bookServiceClient.send({ cmd: 'delete_book' }, { id }));
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "createBook", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "updateBook", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getBook", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "getBooks", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "deleteBook", null);
exports.BooksController = BooksController = __decorate([
    (0, common_1.Controller)('books'),
    __param(0, (0, common_1.Inject)('BOOK_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], BooksController);
//# sourceMappingURL=books.controller.js.map