import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { StoryService } from './story.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@Controller('story')
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Get()
  list() {
    return this.storyService.list();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@GetUser('id') userId: number, @Body() payload: any) {
    payload.created_by = +userId;
    return this.storyService.create(payload);
  }

  @Patch()
  update() {}
}
