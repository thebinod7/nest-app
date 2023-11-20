import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// TODO: Implement DTO
@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService) {}

  create(payload: any) {
    return this.prisma.story.create({ data: payload });
  }

  async edit(storyId: number, dto: any) {
    console.log({ storyId });
    try {
      const doc = await this.prisma.story.update({
        where: {
          id: storyId,
        },
        data: { ...dto },
      });
      return doc;
    } catch (err) {
      throw err;
    }
  }

  list() {
    return this.prisma.story.findMany();
  }
}
