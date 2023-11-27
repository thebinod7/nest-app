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

//TODO: Check manage=>all and manage=>subject condition
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
        this.reflector.get<RequiredRule[]>(
          CHECK_ABILITY,
          context.getHandler(),
        ) || [];
      const { action, subject } = rules[0];

      // Get permissions of current user
      const currentUser: User = context.switchToHttp().getRequest().user;
      const query = { roleId: currentUser.roleId };
      const userPermissions = await this.prisma.permission.findMany({
        where: query,
      });

      console.log('UserPerms=>', userPermissions);
      const manageAll = this.canManageAll(userPermissions);
      if (manageAll) return true;
      const manageSubject = this.canManageSubject(userPermissions, subject);
      if (!manageSubject)
        throw new HttpException('Permission denied for this subject!', 401);

      // Calculate permissions with required actions
      const perms = userPermissions.map((u) => u.action);
      const permGrant = perms.includes(action);
      if (!permGrant)
        throw new HttpException(
          'You are not allowed to perform this action!',
          401,
        );
      return permGrant;
    } catch (error) {
      throw new HttpException(error.message, 401);
    }
  }

  canManageAll(userPermissions: any) {
    for (const permission of userPermissions) {
      if (
        permission.action === ACTIONS.MANAGE &&
        permission.subject === SUBJECTS.ALL
      )
        return true;
    }

    return false;
  }

  canManageSubject(userPermissions: any, subject: string) {
    for (const permission of userPermissions) {
      if (permission.subject === subject) return true;
    }

    return false;
  }
}
