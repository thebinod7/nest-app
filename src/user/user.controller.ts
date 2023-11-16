import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
// import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import {
  AbilityFactory,
  Action,
} from 'src/ability/ability.factory/ability.factory';
import { checkAbilities } from 'src/ability/ability.decorator';

// TODO: Remove this
import { User } from './entity/user.entity';
import { AbilityGuard } from 'src/ability/ability.guard';

// @UseGuards(JwtGuard) // For all endpoints
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private abFactory: AbilityFactory,
  ) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('all')
  @UseGuards(AbilityGuard)
  @checkAbilities({ action: Action.Read, subject: User })
  listUsers(@GetUser() user: User) {
    return { message: 'ALl users' };
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
