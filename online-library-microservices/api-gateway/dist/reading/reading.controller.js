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
exports.ReadingGatewayController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ReadingGatewayController = class ReadingGatewayController {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    readingServiceUrl = 'http://localhost:3002';
    async create(dto) {
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.readingServiceUrl}/reading-progress`, dto));
        return data;
    }
    async getProgress(userId) {
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.readingServiceUrl}/reading-progress/${userId}`));
        return data;
    }
    async update(id, dto) {
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.put(`${this.readingServiceUrl}/reading-progress/${id}`, dto));
        return data;
    }
    async delete(id) {
        const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`${this.readingServiceUrl}/reading-progress/${id}`));
        return data;
    }
};
exports.ReadingGatewayController = ReadingGatewayController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReadingGatewayController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReadingGatewayController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReadingGatewayController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReadingGatewayController.prototype, "delete", null);
exports.ReadingGatewayController = ReadingGatewayController = __decorate([
    (0, common_1.Controller)('reading-progress'),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ReadingGatewayController);
//# sourceMappingURL=reading.controller.js.map