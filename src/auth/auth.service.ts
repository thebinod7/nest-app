import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {ethers} from 'ethers'
import { totp } from 'otplib';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { EMAIL_TEMPLATES } from '../constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailSevice: MailService,
  ) {}

  async walletLogin(dto: any) {
    console.log("Wallet=>", dto)
    const messageHash = ethers?.hashMessage(ethers?.toUtf8Bytes(dto.message));
    const walletAddress = ethers?.recoverAddress(messageHash, dto.signature);
    if(!dto.roleId) dto.roleId = 2;
    dto.authAddress = walletAddress
    dto.authType = 'WALLET';
    console.log("DTO==>",dto)
    // Get signature from API
    // Validate signature
    // IF_INVALID: throw err
    // Upsert on the basis of wallet address
    // Send back accessToken 
  }

  async login(dto: LoginDto) {
    try {
      const OTP_SECRET = this.config.get('OTP_SECRET');
      const otpStr = dto.otp.toString();
      const isValid = totp.check(otpStr, OTP_SECRET);
      if(!isValid) throw new ForbiddenException('OTP did not match!');
      // Get user by authAddress
      const user = await this.prisma.user.findUnique({where: {authAddress:dto.authAddress} });
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
      if(!dto.roleId) dto.roleId = 2;
      const otp = totp.generate(OTP_SECRET);
      // Upsert user by authAddress and authType
      const user = await this.prisma.user.upsert({
        where: {
          authAddress: dto.authAddress,
        },
        update: { roleId: dto.roleId, otp: +otp},
        create: dto,
      });

      // Send OTP and response
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

  async singup(dto: AuthDto) {
    // try {
    //   const hash = await argon.hash(dto.password);
    //   const user = await this.prisma.user.create({
    //     data: {
    //       roleId: +dto.roleId,
    //       email: dto.email,
    //       hash,
    //     },
    //   });
    //   delete user.hash;
    //   return user;
    // } catch (err) {
    //   if (err instanceof PrismaClientKnownRequestError) {
    //     if (err.code === 'P2002') {
    //       throw new ForbiddenException('Email taken!');
    //     }
    //     throw err;
    //   }
    // }
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

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      accessToken: token,
    };
  }
}
