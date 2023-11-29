import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreatePermissionDto, CreateRoleDto, UpdatePermissionDto } from './dto';
import { CheckAbilities } from '../ability/ability.decorator';
import { JwtGuard } from '../auth/guard';
import { AbilitiesGuard } from '../ability/ability.guard';
import { ACTIONS, SUBJECTS } from '../constants';

@Controller('roles')
export class RolesController {
	constructor(private roleService: RolesService) {}

	@CheckAbilities({ action: ACTIONS.CREATE, subject: SUBJECTS.ROLE })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Post()
	createRole(@Body() dto: CreateRoleDto) {
		return this.roleService.createRole(dto);
	}

	@CheckAbilities({ action: ACTIONS.DELETE, subject: SUBJECTS.ROLE })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Delete(':id')
	deleteRole(@Param('id') id: number) {
		return this.roleService.deleteRole(id);
	}

	@CheckAbilities({ action: ACTIONS.READ, subject: SUBJECTS.ROLE })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Get()
	listRoles() {
		return this.roleService.listRoles();
	}

	// ============Permission Routes=======
	@CheckAbilities({ action: ACTIONS.CREATE, subject: SUBJECTS.PERMISSION })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Post('perm')
	createPermission(@Body() dto: CreatePermissionDto) {
		return this.roleService.createPermission(dto);
	}

	@CheckAbilities({ action: ACTIONS.READ, subject: SUBJECTS.PERMISSION })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Get('perms')
	listPermissions() {
		return this.roleService.listPermissions();
	}

	@CheckAbilities({ action: ACTIONS.READ, subject: SUBJECTS.PERMISSION })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Get(':roleId/perms')
	listPermsByRole(@Param('roleId') roleId: number) {
		return this.roleService.listPermissionsByRole(+roleId);
	}

	@CheckAbilities({ action: ACTIONS.DELETE, subject: SUBJECTS.PERMISSION })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Delete(':permId/perms')
	deletePermission(@Param('permId') permId: number) {
		return this.roleService.deletePermission(+permId);
	}

	@CheckAbilities({ action: ACTIONS.UPDATE, subject: SUBJECTS.PERMISSION })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Patch(':permId/perms')
	updatePermission(
		@Param('permId') permId: number,
		@Body() dto: UpdatePermissionDto,
	) {
		return this.roleService.updatePermission(+permId, dto);
	}
}
