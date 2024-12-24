import { SetMetadata } from '@nestjs/common';

import { ROLES_KEY } from '../constants';
import { Role } from '../types';

export const SetRolesAllowed = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
