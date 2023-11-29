import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, OtpDto, WalletLoginDto } from './dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@Post('signup')
	singup(@Body() dto: SignupDto) {
		return this.authService.singup(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('wallet-login')
	walletLogin(@Body() dto: WalletLoginDto) {
		return this.authService.walletLogin(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('otp')
	auth(@Body() dto: OtpDto) {
		return this.authService.saveAndSendOTP(dto);
	}
}
