import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { API } from 'src/shared/constants/api.constant';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { PaginateQuery } from 'src/shared/decorator/pagination-query.decorator';
import { PaginationOptions } from 'src/shared/helper/pagination.helper';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ConversationCreateDto } from './dto/conversation-create.dto';
import { ConversationUpdateDto } from './dto/conversation-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  localOptionsConversationAvatar,
} from '../shared/helper/file.helper';
import { ConversationAddMemberDto } from './dto/conversation-add-member.dto';

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
  async update(
    @GetUser() { sub },
    @Param('id') id: string,
    @Body() dto: ConversationUpdateDto,
  ) {
    return this.conversationService.update(sub, id, dto);
  }

  @Get(API.CONVERSATION.FIND_BY_ID)
  async findById(@GetUser() { sub }, @Param('id') id: string) {
    return this.conversationService.findById(sub, id);
  }

  @UseInterceptors(FileInterceptor('avatar', localOptionsConversationAvatar))
  @Post(API.CONVERSATION.CHANGE_AVATAR)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async changeAvatar(@Param('id') id: string, @UploadedFile() file) {
    return this.conversationService.changeAvatar(id, file);
  }

  @Post(API.CONVERSATION.ADD_MEMBER)
  async addMembers(@GetUser() { sub }, @Body() dto: ConversationAddMemberDto) {
    return this.conversationService.addMembers(sub, dto);
  }
}
