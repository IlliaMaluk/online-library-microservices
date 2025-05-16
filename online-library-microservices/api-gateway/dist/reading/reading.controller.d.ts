import { HttpService } from '@nestjs/axios';
export declare class ReadingGatewayController {
    private readonly httpService;
    constructor(httpService: HttpService);
    private readonly readingServiceUrl;
    create(dto: any): Promise<any>;
    getProgress(userId: string): Promise<any>;
    update(id: string, dto: any): Promise<any>;
    delete(id: string): Promise<any>;
}
