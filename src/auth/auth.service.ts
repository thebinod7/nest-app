import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';

// TODO: Fix AuthDto interface
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: any) {
    try {
      const doc = this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!doc) throw new ForbiddenException('User not found!');
      const match = await argon.verify((await doc).hash, dto.password);
      if (!match) throw new ForbiddenException('Password did not match!');
      return this.signToken((await doc).id, (await doc).email);
    } catch (err) {
      throw err;
    }
  }

  async singup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          roleId: +dto.roleId,
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Email taken!');
        }
        throw err;
      }
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
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
