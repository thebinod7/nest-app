import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { checkAbilites } from 'src/ability/ability.decorator';
import { ACTIONS, SUBJECTS } from 'src/constants';
import { AbilitiesGuard } from 'src/ability/ability.guard';

@Controller('story')
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Get()
  list() {
    return this.storyService.list();
  }

  @checkAbilites({
    action: ACTIONS.CREATE,
    subject: SUBJECTS.STORY,
  })
  @UseGuards(JwtGuard)
  @Post()
  create(@GetUser('id') userId: number, @Body() payload: any) {
    payload.created_by = +userId;
    return this.storyService.create(payload);
  }

  @checkAbilites({
    action: ACTIONS.READ,
    subject: SUBJECTS.STORY,
    conditions: true,
  })
  @UseGuards(JwtGuard, AbilitiesGuard)
  @Patch(':id')
  update(@GetUser() user: any, @Param() params: any, @Body() payload: any) {
    const storyId = +params.id;
    return this.storyService.edit(storyId, payload);
  }
}
