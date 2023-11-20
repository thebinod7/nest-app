import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  listRoles() {
    return this.prisma.role.findMany();
  }

  listPermissions() {
    return this.prisma.permission.findMany();
  }
}
