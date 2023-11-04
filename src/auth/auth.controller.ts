import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  singup() {
    return this.authService.singup();
  }

  @Get('login')
  login() {
    return this.authService.login();
  }
}
