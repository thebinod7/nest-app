import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateRoleDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	isSystem?: boolean;
}

export class EditRoleDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	isSystem?: boolean;
}

export class CreatePermissionDto {
	@IsNotEmpty()
	action: string;

	@IsNotEmpty()
	subject: string;

	@IsNotEmpty()
	roleId: number;
}

export class UpdatePermissionDto {
	@IsOptional()
	@IsString()
	action: string;

	@IsOptional()
	@IsString()
	subject: string;

	@IsOptional()
	@IsNumber()
	roleId: number;
}
