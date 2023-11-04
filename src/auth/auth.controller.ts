import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  singup(@Body() dto: AuthDto) {
    console.log('DTO', dto);
    return this.authService.singup(dto);
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
