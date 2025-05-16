import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
export declare class AuthGuard implements CanActivate {
    private readonly userClient;
    private readonly logger;
    constructor(userClient: ClientProxy);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
