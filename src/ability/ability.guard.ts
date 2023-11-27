import * as Mustache from 'mustache';

import { User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { FastifyRequest } from 'fastify';

import { map, size } from 'lodash';

import { RequiredRule, CHECK_ABILITY } from './ability.decorator';

import {
  subject,
  RawRuleOf,
  MongoAbility,
  ForcedSubject,
  ForbiddenError,
  createMongoAbility,
} from '@casl/ability';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

export const actions = [
  'read',
  'manage',
  'create',
  'update',
  'delete',
] as const;

export const subjects = ['Story', 'User', 'all'] as const;

export type Abilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
];

export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  createAbility = (rules: RawRuleOf<AppAbility>[]) =>
    createMongoAbility<AppAbility>(rules);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Required rules sent from controller
    const rules: any =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const currentUser: User = context.switchToHttp().getRequest().user;
    const request: FastifyRequest = context.switchToHttp().getRequest();

    // Get permissions by roleID and subject
    const userPermissions = await this.prisma.permission.findMany({
      where: {
        roleId: currentUser.roleId,
        subject: rules[0].subject
      },
    });

    const perms = userPermissions.map((u) => u.action);
    const permGrant = perms.includes(rules[0].action);
    if(!permGrant) throw new ForbiddenException('You are not allowed to perform this action');
   

    try {
      // Ability calculated based on permissions
      const parsedUserPermissions = this.parseCondition(userPermissions,currentUser);
      const ability = this.createAbility(Object(parsedUserPermissions));

      for await (const rule of rules) {
        let sub = {};
        //prev: size(rule?.conditions)
        if (rule?.conditions) {
          const subId = +request.params['id'];
          sub = await this.getSubjectById(subId, rule.subject);
        }

        ForbiddenError.from(ability)
          .setMessage('You are not allowed to perform this action')
          .throwUnlessCan(rule.action, subject(rule.subject, sub));
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  parseCondition(permissions: any, currentUser: User) {
    const data = map(permissions, (permission) => {
      if (size(permission.conditions)) {
        // Attach authorID if matchaes currentUser
        const parsedVal = Mustache.render(
          permission.conditions['author'],
          currentUser,
        );
        return {
          ...permission,
          conditions: { author: +parsedVal },
        };
      }
      return permission;
    });
    return data;
  }

  async getSubjectById(id: number, subName: string) {
    const subject = await this.prisma[subName].findUnique({
      where: {
        id,
      },
    });
    if (!subject) throw new NotFoundException(`${subName} not found`);
    return subject;
  }
}
