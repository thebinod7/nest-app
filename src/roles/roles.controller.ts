import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreatePermissionDto, CreateRoleDto, UpdatePermissionDto } from './dto';
import { CheckAbilities } from 'src/ability/ability.decorator';
import { JwtGuard } from 'src/auth/guard';
import { AbilitiesGuard } from 'src/ability/ability.guard';
import { ACTIONS, SUBJECTS } from 'src/constants';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post()
  createRole(@Body() dto: CreateRoleDto) {
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

  // ============Permission Routes=======
  @Post('perm')
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.roleService.createPermission(dto);
  }

  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ action: ACTIONS.READ, subject: SUBJECTS.PERMISSION })
  @Get('perms')
  listPermissions() {
    return this.roleService.listPermissions();
  }

  @Get(':roleId/perms')
  listPermsByRole( @Param('roleId') roleId: number) {
    return this.roleService.listPermissionsByRole(+roleId);
  }

  @Delete(':permId/perms')
  deletePermission( @Param('permId') permId:number ) {
    return this.roleService.deletePermission(+permId);
  }

  @Patch(':permId/perms')
  updatePermission( @Param('permId') permId: number, @Body() dto: UpdatePermissionDto) {
    return this.roleService.updatePermission(+permId, dto);
  }

}
