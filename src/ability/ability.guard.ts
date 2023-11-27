import { User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RequiredRule, CHECK_ABILITY } from './ability.decorator';
import { ACTIONS, SUBJECTS } from 'src/constants';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Required rules sent from controller
    try {
      const rules: any =
          this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];
      const { action, subject = SUBJECTS.ALL } = rules[0];

      // Get permissions of current user
      const currentUser: User = context.switchToHttp().getRequest().user;
      const query = { roleId: currentUser.roleId, subject: subject };
      if(subject === SUBJECTS.ALL) delete query.subject;
      const userPermissions = await this.prisma.permission.findMany({
        where: query,
      });

      // Calculate permissions with required actions
      const perms = userPermissions.map((u) => u.action);
      if(perms.length && action === ACTIONS.MANAGE) return true;
      const permGrant = perms.includes(action);
      if(!permGrant) throw new HttpException('You are not allowed to perform this action!', 401);
      return permGrant;
    } catch (error) {
      throw new HttpException(error.message, 401);
    }
  }
}
