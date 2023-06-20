import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API } from 'src/shared/constants/api.constant';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { PaginateQuery } from 'src/shared/decorator/pagination-query.decorator';
import { PaginationOptions } from 'src/shared/helper/pagination.helper';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ConversationCreateDto } from './dto/conversation-create.dto';

@Controller(API.CONVERSATION.INDEX)
@ApiTags('Conversation')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get(API.CONVERSATION.FIND_ALL_BY_USER)
  async findAll(
    @GetUser() { sub },
    @PaginateQuery() options: PaginationOptions,
  ) {
    return this.conversationService.findAll(sub, options);
  }

  @Post(API.CONVERSATION.CREATE)
  async create(@GetUser() { sub }, @Body() dto: ConversationCreateDto) {
    return this.conversationService.create(sub, dto);
  }

  @Put(API.CONVERSATION.UPDATE)
  async update() {
    return null;
  }

  @Get(API.CONVERSATION.FIND_BY_ID)
  async findById() {
    return null;
  }

  @Post(API.CONVERSATION.CHANGE_AVATAR)
  async changeAvatar() {
    return null;
  }

  @Post(API.CONVERSATION.ADD_MEMBER)
  async addMembers() {
    return null;
  }
}
