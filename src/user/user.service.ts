import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const USER_ROLE_ID = 3;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: any) {
    try {
      if(!dto.roleId) dto.roleId = USER_ROLE_ID;
      const user = await this.prisma.user.create({
        data: dto
      });
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Your ID is taken!');
        }
        throw err;
      }
    }
  }

  async updateProfile(userId: number, dto: EditUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: { ...dto },
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateOtpByAddress(authAddress: string, otp: number) {
    try {
      const user = await this.prisma.user.update({
        where: {
          authAddress,
        },
        data: { otp },
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async listUsers() {
    return this.prisma.user.findMany();
  }

  getUserById(userId: number){
    return this.prisma.user.findUnique({where:{ id: userId }})
  }

  getUserByAuthAddress(authAddress: string){
    return this.prisma.user.findUnique({where:{ authAddress }})
  }

  async deleteUser(userId:number) {
    try {
      const user = await this.getUserById(userId);
      if(!user) throw new HttpException('User does not exist!', 500);
      return this.prisma.user.delete({where:{id: +userId}})
    } catch(err) {
      throw err;
    }
  }

}
