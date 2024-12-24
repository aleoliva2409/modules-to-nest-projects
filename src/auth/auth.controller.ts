import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';

import { Response } from 'express';

import { AuthService } from './auth.service';
import { GoogleOauthGuard, RefreshJwtGuard } from 'src/shared/guards';
import { GetUser } from 'src/shared/decorators';
import { LoginDto, RegisterDto } from './dto';
import { CreateUserDto } from 'src/users/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: RegisterDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh-token')
  refreshToken(@GetUser('id') userId: string) {
    return this.authService.refreshToken(userId);
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  googleCallback(@GetUser() user: CreateUserDto, @Res() res: Response) {
    return this.authService.googleLogin(user, res);
  }
}
