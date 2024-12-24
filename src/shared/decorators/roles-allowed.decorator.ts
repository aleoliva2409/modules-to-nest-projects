import { UseGuards, applyDecorators } from '@nestjs/common';

import { RoleAllowedGuard } from '../guards';
import { SetRolesAllowed } from './set-roles-allowed.decorator';
import { Role } from '../types';

export const RolesAllowed = (...roles: Role[]) =>
  applyDecorators(SetRolesAllowed(...roles), UseGuards(RoleAllowedGuard));
