import { PrismaClient } from '@prisma/client';
import { cloneDeep } from 'lodash';
export const roles = [
  {
    id: 1,
    name: 'Admin',
    isSystem: true
  },
  {
    id: 2,
    name: 'User',
  },
  {
    id: 3,
    name: 'Editor',
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
    action: 'read',
    subject: 'User',
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
    firstName: 'Binod',
    lastName: 'Chaudhary',
    roleId: 1, 
    authAddress: 'binod@mailinator.com',
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    roleId: 2,
    authAddress: 'john@mailinator.com',
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
