import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        console.log('User object in RolesGuard:', request.user);
        const user = request.user;
        if (user && user.role === 'admin') {
            return true;
        }
        throw new ForbiddenException('You do not have permission to perform this action.');
    }
}
