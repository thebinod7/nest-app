import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {ethers} from 'ethers'
import { totp } from 'otplib';
import {  LoginDto, SignupDto, WalletLoginDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { EMAIL_TEMPLATES } from '../constants';
import { UserService } from '../user/user.service';
totp.options = { step: 120 };

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private mailSevice: MailService,
    private userService: UserService
  ) {}

  async walletLogin(dto: WalletLoginDto) {
    try {
      const messageHash = ethers?.hashMessage(ethers?.toUtf8Bytes(dto.message));
      const walletAddress = ethers?.recoverAddress(messageHash, dto.signature);
      const user = await this.userService.getUserByAuthAddress(walletAddress);
      if(!user) throw new ForbiddenException('User does not exist!');
      return this.signToken(user.id, user.authAddress);
    } catch(err){
      throw err;
    }
  }

  async login(dto: LoginDto) {
    try {
      const OTP_SECRET = this.config.get('OTP_SECRET');
      const isValid = totp.check(dto.otp.toString(), OTP_SECRET);
      if(!isValid) throw new ForbiddenException('OTP did not match!');
      // Get user by authAddress
      const user = await this.userService.getUserByAuthAddress(dto.authAddress);
      if(!user) throw new ForbiddenException('User not found!');
      delete user.otp;
      // Sign token
      return this.signToken(user.id, user.authAddress);
    } catch (err) {
      throw err;
    }
  }

  async saveAndSendOTP(dto: any) {
    try {
      const OTP_SECRET = this.config.get('OTP_SECRET');
      const otp = totp.generate(OTP_SECRET);
      const exist = await this.userService.getUserByAuthAddress(dto.authAddress);
      if(!exist) throw new HttpException('User does not exist!', 404);
      const user = await this.userService.updateOtpByAddress(dto.authAddress, +otp);
      const context = {
        name: dto.firstName,
        to: dto.authAddress,
        template: EMAIL_TEMPLATES.LOGIN,
        subject: 'OTP for login',
      };
      await this.mailSevice.sendUserConfirmation(context, otp);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async singup(dto: SignupDto) {
    try {
      return this.userService.createUser(dto);
    } catch (err) {
      throw err;
    }
  }

  async signToken(
    userId: number,
    authAddress: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      authAddress,
    };
    const secret = this.config.get('JWT_SECRET');
    const expiryTime = this.config.get('JWT_EXPIRY_TIME');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiryTime,
      secret: secret,
    });

    return {
      accessToken: token,
    };
  }
}
