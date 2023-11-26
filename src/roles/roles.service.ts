import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermissionDto, CreateRoleDto, UpdatePermissionDto } from './dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  createRole(dto: CreateRoleDto) {
    try {
      return this.prisma.role.create({data:dto})
    } catch(err){
      throw err;
    }
  }

  listRoles() {
    try {
      return this.prisma.role.findMany();
    } catch(err) {
      throw err;
    }
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

  listPermissionsByRole(roleId:number) {
    return this.prisma.permission.findMany({where:{
      roleId
    }});
  }

  createPermission(dto: CreatePermissionDto) {
    try {
      return this.prisma.permission.create({data:dto})
    } catch(err){
      throw err;
    }
  }

  async updatePermission(permId:number, dto: UpdatePermissionDto) {
    try {
      const perm = await this.getPermissionById(+permId);
      if(!perm) throw new HttpException('Permission does not exist!', 500);
      return this.prisma.permission.update({where:{
        id: permId
      },  data: dto })
    } catch(err) {
      throw err;
    }
  }

  getPermissionById(permId: number) {
    return this.prisma.permission.findUnique({where: {id: +permId}})
  }


  async deletePermission(permId:number) {
    try {
      const perm = await this.getPermissionById(permId);
      if(!perm) throw new HttpException('Permission does not exist!', 500);
      return this.prisma.permission.delete({where:{id: +permId}})
    } catch(err) {
      throw err;
    }
  }

}
