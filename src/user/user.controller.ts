import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { AbilitiesGuard } from 'src/ability/ability.guard';
import { checkAbilites } from 'src/ability/ability.decorator';

// @UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @checkAbilites({ action: 'manage', subject: 'all' })
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
