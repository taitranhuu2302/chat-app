import { Body, Controller, Param, Delete, Post, UseGuards } from '@nestjs/common';
import { API } from '../shared/constants/api.constant';
import { ReactionsService } from './reactions.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ReactionCreateDto } from './dto/reaction-create.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags("Reactions")
@Controller(API.REACTIONS.INDEX)
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ReactionsController {
  constructor(private reactionService: ReactionsService) {}

  @Post(API.REACTIONS.UPSERT)
  async createReaction(@GetUser() { sub }, @Body() dto: ReactionCreateDto) {
    return this.reactionService.createReactWithMessage(sub, dto);
  }

  @Delete(API.REACTIONS.UN_REACTION)
  async removeReactions(@GetUser() { sub }, @Param('messageId') messageId: string) {
    return this.reactionService.removeReactions(sub, messageId);
  }
}
