import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { compareSync } from 'bcrypt';
import { Response } from 'express';

import { UsersService } from 'src/users/users.service';
import { errorManager } from 'src/shared/utils';
import { User } from 'src/users/entities';
import { LoginDto, RegisterDto } from './dto';
import { CreateUserDto } from 'src/users/dto';
import { IAuthResponse, ITokensGenerated } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IAuthResponse> {
    try {
      const userInDb = await this.usersService.findOneWithFilters({
        where: { email: registerDto.email },
      });

      if (userInDb?.email) {
        throw new BadRequestException(`User ${registerDto.email} already exists`);
      }

      const user = await this.usersService.create(registerDto);

      return {
        ...this.generateJwt(user.id),
        user,
      };
    } catch (error) {
      errorManager(error);
    }
  }

  async login(loginDto: LoginDto): Promise<IAuthResponse> {
    try {
      const { email, password } = loginDto;
      const user = await this.usersService.findOneWithFilters({
        where: { email },
        select: { id: true, email: true, password: true, fullName: true },
      });

      if (!user) {
        throw new UnauthorizedException('Credentials are not authorized');
      }

      const { password: userPass, ...restUser } = user;

      if (!compareSync(password, userPass)) {
        throw new UnauthorizedException('Credentials are not authorized');
      }

      return {
        ...this.generateJwt(restUser.id),
        user: restUser as User,
      };
    } catch (error) {
      errorManager(error);
    }
  }

  async googleLogin(createUserDto: CreateUserDto, res: Response) {
    try {
      const { email } = createUserDto;

      let userToLoggin = await this.usersService.findOneWithFilters({
        where: { email },
      });

      if (!userToLoggin) {
        userToLoggin = await this.usersService.create(createUserDto);
      }

      const userTokens = this.generateJwt(userToLoggin.id);
      const urlToRedicrect = `${this.configService.getOrThrow<string>('REDIRECT_AUTH_TOKEN')}?token=${userTokens.token}&refresh=${userTokens.refreshToken}`;

      res.redirect(urlToRedicrect);
    } catch (error) {
      errorManager(error);
    }
  }

  async refreshToken(userId: string) {
    try {
      const user = await this.usersService.findOne(userId);

      return {
        ...this.generateJwt(user.id),
        user,
      };
    } catch (error) {
      errorManager(error);
    }
  }

  private generateJwt(userId: string): ITokensGenerated {
    return {
      token: this.jwtService.sign({ id: userId }),
      refreshToken: this.jwtService.sign(
        { id: userId },
        {
          secret: this.configService.getOrThrow<string>('REFRESH_JWT_SECRET'),
          expiresIn: this.configService.getOrThrow<string>('REFRESH_JWT_EXPIRE_IN'),
        },
      ),
    };
  }
}
