import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// TODO: Implement DTO
@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService) {}

  create(payload: any) {
    return this.prisma.story.create({ data: payload });
  }

  update(payload: any) {
    return this.prisma.story.create({
      data: payload,
    });
  }

  list() {
    return this.prisma.story.findMany();
  }
}
