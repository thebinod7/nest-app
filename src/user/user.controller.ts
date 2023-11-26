import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { AbilitiesGuard } from 'src/ability/ability.guard';
import { CheckAbilities } from 'src/ability/ability.decorator';
import { ACTIONS, SUBJECTS } from '../constants';

// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  @UseGuards(JwtGuard, AbilitiesGuard)
  getMe(@GetUser() user: User) {
    return user;
  }

  @CheckAbilities({ action: ACTIONS.MANAGE, subject: SUBJECTS.ALL })
  @UseGuards(JwtGuard, AbilitiesGuard)
  @Get('')
  listAll() {
    return this.userService.listUsers();
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
