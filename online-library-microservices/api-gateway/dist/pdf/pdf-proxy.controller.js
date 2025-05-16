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
exports.PdfProxyController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let PdfProxyController = class PdfProxyController {
    http;
    constructor(http) {
        this.http = http;
    }
    async proxy(url, res) {
        try {
            const { data, headers, status } = await (0, rxjs_1.firstValueFrom)(this.http.get(url, {
                responseType: 'stream',
                validateStatus: () => true,
            }));
            if (status !== 200) {
                return res
                    .status(status)
                    .send(`Помилка від джерела: ${status}`);
            }
            const contentType = headers['content-type'];
            const contentLength = headers['content-length'];
            if (!contentType?.includes('pdf')) {
                return res.status(415).send('Не PDF-файл');
            }
            res.writeHead(200, {
                'Content-Type': contentType,
                ...(contentLength && { 'Content-Length': contentLength }),
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Cache-Control': 'no-cache',
                'Accept-Ranges': 'bytes',
                'Content-Disposition': 'inline; filename="file.pdf"',
            });
            data.pipe(res);
        }
        catch (err) {
            console.error('PDF proxy error:', err);
            res.status(500).send('Помилка проксі: ' + err.message);
        }
    }
};
exports.PdfProxyController = PdfProxyController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('url')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PdfProxyController.prototype, "proxy", null);
exports.PdfProxyController = PdfProxyController = __decorate([
    (0, common_1.Controller)('pdf-proxy'),
    __metadata("design:paramtypes", [axios_1.HttpService])
], PdfProxyController);
//# sourceMappingURL=pdf-proxy.controller.js.map