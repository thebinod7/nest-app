import { PrismaClient } from '@prisma/client';
import { cloneDeep } from 'lodash';
export const roles = [
  {
    id: 1,
    name: 'Super Admin',
    isSystem: true
  },
  {
    id: 2,
    name: 'Admin',
  },
  {
    id: 3,
    name: 'User',
  },
];

export const permissions = [
  {
    id: 1,
    roleId: 1,
    action: 'manage',
    subject: 'all',
  },
  {
    id: 2,
    roleId: 2,
    action: 'manage',
    subject: 'role',
  },
  {
    id: 3,
    roleId: 2,
    action: 'manage',
    subject: 'permission',
  },
  {
    id: 4,
    roleId: 2,
    action: 'read',
    subject: 'user',
  },
  {
    id: 5,
    roleId: 2,
    action: 'update',
    subject: 'user',
  },
  {
    id: 6,
    roleId: 3,
    action: 'read',
    subject: 'all',
  },
  {
    id: 7,
    roleId: 3,
    action: 'update',
    subject: 'user',
  },
  // {
  //   id: 3,
  //   roleId: 2,
  //   action: 'manage',
  //   subject: 'Story',
  //   conditions: { author: '{{ id }}' },
  // },
];

export const users = [
  {
    id: 1,
    firstName: 'Super',
    lastName: 'Admin',
    roleId: 1, 
    authAddress: 'super@mailinator.com',
  },
  {
    id: 2,
    firstName: 'Mr',
    lastName: 'Admin',
    roleId: 2,
    authAddress: 'admin@mailinator.com',
  },
  {
    id: 3,
    firstName: 'Mr',
    lastName: 'User',
    roleId: 3,
    authAddress: 'user@mailinator.com',
  },
];

const prisma = new PrismaClient();

async function main() {
  // ===========Create Roles=============
  for await (const role of roles) {
    const roleAttrs = cloneDeep(role);
    delete roleAttrs.id;
    await prisma.role.upsert({
      where: {
        id: role.id,
      },
      create: roleAttrs,
      update: roleAttrs,
    });
  }

  // ===========Create Permissions==========
  for await (const permission of permissions) {
    const permissionAttrs = cloneDeep(permission);
    delete permissionAttrs.id;
    await prisma.permission.upsert({
      where: {
        id: permission.id,
      },
      create: permissionAttrs,
      update: permissionAttrs,
    });
  }

  // ==============Create Users===============
  for await (const user of users) {
    const userAttrs = cloneDeep(user);
    delete userAttrs.id;
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: userAttrs,
      update: userAttrs,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
  });
