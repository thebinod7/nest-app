import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // Calls constructor of parent class
    super({
      datasources: {
        db: {
          url: 'postgresql://binod:binod123@localhost:5434/nest?schema=public',
        },
      },
    });
  }
}
