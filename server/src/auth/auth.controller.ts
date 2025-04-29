import { Body, Controller, Headers, Ip, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ACCESS_TOKEN_COOKIE_EXPIRATION, REFRESH_TOKEN_COOKIE_EXPIRATION } from 'src/common/constants/jwt.constants';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authService.login(loginDto, res);
  }
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Headers('user-agent') userAgent: string,
    @Res() res: Response,
    @Ip() ipAddress: string,
  ) {
    await this.authService.logout({ userAgent, ipAddress, req, res });
  }

}
