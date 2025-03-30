import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createUser(data: { username: string; password: string; role: string }): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = this.userRepository.create({
            username: data.username,
            password: hashedPassword,
            role: data.role === 'admin' ? UserRole.ADMIN : UserRole.USER,
        });
        return this.userRepository.save(user);
    }

    async loginUser(data: { username: string; password: string }): Promise<{ token: string }> {
        const user = await this.userRepository.findOne({ where: { username: data.username } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(data.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: user.username, sub: user.id, role: user.role };

        const token = jwt.sign(payload, 'secretKey', { expiresIn: '1h' });
        return { token };
    }

    async validateToken(token: string): Promise<any> {
        try {
            const decoded = jwt.verify(token, 'secretKey');
            const user = await this.userRepository.findOne({ where: { username: decoded['username'] } });
            if (user) {
                return { valid: true, user };
            }
            return { valid: false };
        } catch (error) {
            return { valid: false };
        }
    }
}
