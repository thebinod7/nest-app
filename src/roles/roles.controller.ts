import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRole } from './dto';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post()
  createRole(@Body() dto: CreateRole) {
    return this.roleService.createRole(dto);
  }

  @Delete(':id')
  deleteRole( @Param('id') id:number) {
    return this.roleService.deleteRole(id);
  }

  @Get()
  listRoles() {
    return this.roleService.listRoles();
  }

  @Get('permissions')
  listPermissions() {
    return this.roleService.listPermissions();
  }
}
