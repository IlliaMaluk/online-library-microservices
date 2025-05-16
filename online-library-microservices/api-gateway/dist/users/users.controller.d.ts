import { ClientProxy } from '@nestjs/microservices';
export declare class UsersController {
    private readonly userService;
    constructor(userService: ClientProxy);
    registerUser(data: {
        username: string;
        password: string;
        role: string;
    }): Promise<any>;
    loginUser(data: {
        username: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
}
