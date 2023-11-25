import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto, OtpDto, WalletDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  singup(@Body() dto: AuthDto) {
    return this.authService.singup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('wallet-login')
  walletLogin(@Body() dto: WalletDto) {
    return this.authService.walletLogin(dto);
  }

  @Post('otp')
  auth(@Body() dto: OtpDto) {
    return this.authService.saveAndSendOTP(dto);
  }
}
