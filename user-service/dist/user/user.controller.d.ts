import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(data: {
        username: string;
        password: string;
        role: string;
    }): Promise<import("./user.entity").User>;
    loginUser(data: {
        username: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
    verifyToken(data: {
        token: string;
    }): Promise<any>;
}
