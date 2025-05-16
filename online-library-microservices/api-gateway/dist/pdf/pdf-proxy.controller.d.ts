import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
export declare class PdfProxyController {
    private readonly http;
    constructor(http: HttpService);
    proxy(url: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
