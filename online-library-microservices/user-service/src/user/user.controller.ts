import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @MessagePattern({ cmd: 'create_user' })
    async createUser(data: { username: string; password: string; role: string }) {
        return this.userService.createUser(data);
    }

    @MessagePattern({ cmd: 'login_user' })
    async loginUser(data: { username: string; password: string }) {
        return this.userService.loginUser(data);
    }

    @MessagePattern({ cmd: 'auth.verify' })
    async verifyToken(data: { token: string }) {
        return this.userService.validateToken(data.token);
    }
}
