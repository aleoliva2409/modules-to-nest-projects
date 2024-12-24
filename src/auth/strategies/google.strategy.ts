import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-google-oauth20';

import { CreateUserDto } from 'src/users/dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    // done: VerifyCallback,
  ): Promise<CreateUserDto> {
    const { name, emails } = profile;

    const user: CreateUserDto = {
      email: emails[0].value,
      fullName: `${name.givenName} ${name.familyName}`,
      isGoogleAccount: true,
    };

    return user;
  }
}
