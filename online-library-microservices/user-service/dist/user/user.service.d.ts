import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    createUser(data: {
        username: string;
        password: string;
        role: string;
    }): Promise<User>;
    loginUser(data: {
        username: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
    validateToken(token: string): Promise<{
        valid: boolean;
        user?: User;
    }>;
}
