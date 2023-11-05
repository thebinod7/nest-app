import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// TODO: Fix AuthDto interface
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(dto: any) {
    try {
      const doc = this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!doc) throw new ForbiddenException('User not found!');
      const match = await argon.verify((await doc).hash, dto.password);
      if (!match) throw new ForbiddenException('Password did not match!');
      delete (await doc).hash;
      return doc;
    } catch (err) {
      throw err;
    }
  }

  async singup(dto: any) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
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
}
