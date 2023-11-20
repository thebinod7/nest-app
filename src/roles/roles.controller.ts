import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get()
  listRoles() {
    return this.roleService.listRoles();
  }

  @Get('permissions')
  listPermissions() {
    return this.roleService.listPermissions();
  }
}
