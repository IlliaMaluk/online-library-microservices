import { Controller, Get, Query, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('pdf-proxy')
export class PdfProxyController {
  constructor(private readonly http: HttpService) {}

  @Get()
  async proxy(@Query('url') url: string, @Res() res: Response) {
    try {
      const { data, headers, status } = await firstValueFrom(
        this.http.get(url, {
          responseType: 'stream',
          validateStatus: () => true,
        })
      );

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
    } catch (err) {
      console.error('PDF proxy error:', err);
      res.status(500).send('Помилка проксі: ' + err.message);
    }
  }
}
