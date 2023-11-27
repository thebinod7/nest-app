import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async listUsers() {
    return this.prisma.user.findMany();
  }

  getUserById(userId: number){
    return this.prisma.user.findUnique({where:{ id: userId }})
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
