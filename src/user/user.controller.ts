import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
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

// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@CheckAbilities({ action: ACTIONS.READ, subject: SUBJECTS.USER })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Get('me')
	getMe(@GetUser() user: User) {
		if (user.otp) delete user.otp;
		return user;
	}

	@CheckAbilities({ action: ACTIONS.READ, subject: SUBJECTS.USER })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Get('')
	listAll() {
		return this.userService.listUsers();
	}

	@CheckAbilities({ action: ACTIONS.UPDATE, subject: SUBJECTS.USER })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Patch()
	editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
		return this.userService.updateProfile(userId, dto);
	}

	@CheckAbilities({ action: ACTIONS.DELETE, subject: SUBJECTS.USER })
	@UseGuards(JwtGuard, AbilitiesGuard)
	@Delete(':userId')
	deleteUser(@Param('userId') userId: number) {
		return this.userService.deleteUser(+userId);
	}
}
