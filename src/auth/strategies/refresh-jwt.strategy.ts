import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { IJwtPayload } from '../types/auth.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      secretOrKey: configService.getOrThrow<string>('REFRESH_JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJwtPayload) {
    const { id } = payload;

    const user = await this.usersService.findOneWithFilters({ where: { id } });

    if (!user) throw new UnauthorizedException('Refresh token not valid');

    if (!user.isActive) throw new UnauthorizedException('User is inactive, talk with an admin');

    //?? se agrega a la request
    return user;
  }
}
