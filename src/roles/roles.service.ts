import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRole } from './dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  createRole(dto: CreateRole) {
    try {
      return this.prisma.role.create({data:dto})
    } catch(err){
      throw err;
    }
  }

  listRoles() {
    return this.prisma.role.findMany();
  }

  getRoleById(roleId: number) {
    return this.prisma.role.findUnique({where: {id: +roleId}})
  }

  async deleteRole(roleId:number) {
    try {
      const role = await this.getRoleById(roleId);
      if(!role) throw new HttpException('Roles does not exist!', 500);
      if(role.isSystem) throw new HttpException('System roles are not allowed to delete!', 500);
      return this.prisma.role.delete({where:{id: +roleId}})
    } catch(err) {
      throw err;
    }
  }

  listPermissions() {
    return this.prisma.permission.findMany();
  }

  listPermissionsByRole() {
    return this.prisma.permission.findMany();
  }

  updatePermission() {}

  deletePermission() {}

}
