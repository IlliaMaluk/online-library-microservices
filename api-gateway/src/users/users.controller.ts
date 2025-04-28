import {
  Body,
  Controller,
  Inject,
  Post,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {
  }

  @Post('register')
  async registerUser(
    @Body() data: { username: string; password: string; role: string },
  ): Promise<any> {
    try {
      return await firstValueFrom(
        this.userService.send({ cmd: 'create_user' }, data),
      );
    } catch (err: any) {
      const status = err?.statusCode || 500;
      const errorText =
        status === 400
          ? 'Bad Request'
          : status === 401
            ? 'Unauthorized'
            : 'Internal Server Error';

      throw new HttpException(
        { error: errorText, statusCode: status },
        status,
      );
    }
  }

  @Post('login')
  async loginUser(
    @Body() data: { username: string; password: string },
  ): Promise<{ token: string }> {
    try {
      return await firstValueFrom(
        this.userService.send({ cmd: 'login_user' }, data),
      );
    } catch (err: any) {
      const status = err?.statusCode || 401;
      const errorText =
        status === 400
          ? 'Bad Request'
          : status === 401
            ? 'Unauthorized'
            : 'Internal Server Error';

      throw new HttpException(
        { error: errorText, statusCode: status },
        status,
      );
    }
  }
}
