import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { AbilitiesGuard } from '../ability/ability.guard';
import { CheckAbilities } from '../ability/ability.decorator';
import { ACTIONS, SUBJECTS } from '../constants';
import { SignupDto } from '../auth/dto';

// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@HttpCode(HttpStatus.OK)
	@CheckAbilities({ action: ACTIONS.CREATE, subject: SUBJECTS.ROLE })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Post()
	createRole(@Body() dto: SignupDto) {
		return this.userService.createUser(dto);
	}

	@HttpCode(HttpStatus.OK)
	@CheckAbilities({ action: ACTIONS.READ, subject: SUBJECTS.USER })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Get('me')
	getMe(@GetUser() user: User) {
		if (user.otp) delete user.otp;
		return user;
	}

	@HttpCode(HttpStatus.OK)
	@CheckAbilities({ action: ACTIONS.UPDATE, subject: SUBJECTS.USER })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Patch('profile')
	updateProfile(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
		return this.userService.updateProfile(+userId, dto);
	}

	@HttpCode(HttpStatus.OK)
	@CheckAbilities({ action: ACTIONS.READ, subject: SUBJECTS.USER })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Get('')
	listAll() {
		return this.userService.listUsers();
	}

	@HttpCode(HttpStatus.OK)
	@CheckAbilities({ action: ACTIONS.UPDATE, subject: SUBJECTS.USER })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Patch(':userId')
	editUser(@Param('userId') userId: number, @Body() dto: EditUserDto) {
		return this.userService.updateProfile(+userId, dto);
	}

	@HttpCode(HttpStatus.OK)
	@CheckAbilities({ action: ACTIONS.DELETE, subject: SUBJECTS.USER })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Delete(':userId')
	deleteUser(@Param('userId') userId: number) {
		return this.userService.deleteUser(+userId);
	}
}
