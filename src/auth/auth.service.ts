import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

  async login(dto: LoginDto) {
    try {
      // const doc = this.prisma.user.findUnique({ where: { email: dto.email } });
      // if (!doc) throw new ForbiddenException('User not found!');
      // const match = await argon.verify((await doc).hash, dto.password);
      // if (!match) throw new ForbiddenException('Password did not match!');
      // return this.signToken((await doc).id, (await doc).email);
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
  ): Promise<{ access_token: string }> {
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
      access_token: token,
    };
  }
}
