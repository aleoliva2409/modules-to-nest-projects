import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from 'src/users/entities';
import { ROLES_KEY } from '../constants';
import { Role } from '../types';

@Injectable()
export class RoleAllowedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const rolesAllowed: Role[] = this.reflector.get(ROLES_KEY, context.getHandler());

    if (!rolesAllowed) throw new ForbiddenException("You aren't authorized to access");
    if (rolesAllowed.length === 0) throw new ForbiddenException("You aren't authorized to access");

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new UnauthorizedException('Your user is not authenticated');

    if (!rolesAllowed.includes(user.role)) {
      throw new ForbiddenException("You aren't authorized to access");
    }

    return true;
  }
}
