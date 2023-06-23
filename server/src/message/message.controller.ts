import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { API } from '../shared/constants/api.constant';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { MessageService } from './message.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { PaginateQuery } from '../shared/decorator/pagination-query.decorator';
import { PaginationOptions } from '../shared/helper/pagination.helper';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MessageCreateDto } from './dto/message-create.dto';
import { localOptionsMessageFiles } from '../shared/helper/file.helper';
import { MessageUpdateDto } from './dto/message-update.dto';

@Controller(API.MESSAGE.INDEX)
@ApiTags('Message')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get(API.MESSAGE.FIND_ALL_BY_CONVERSATION)
  async findAllByConversation(
    @GetUser() { sub },
    @PaginateQuery() options: PaginationOptions,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messageService.findAllByConversation(
      sub,
      conversationId,
      options,
    );
  }

  @Post(API.MESSAGE.CREATE)
  @UseInterceptors(FilesInterceptor('files', 10, localOptionsMessageFiles))
  async create(
    @GetUser() { sub },
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: MessageCreateDto,
  ) {
    return this.messageService.create(sub, files, dto);
  }

  @Put(API.MESSAGE.UPDATE)
  async update(
    @GetUser() { sub },
    @Param('id') id: string,
    @Body() dto: MessageUpdateDto,
  ) {
    return this.messageService.update(sub, id, dto);
  }

  @Delete(API.MESSAGE.MESSAGE_RECALL)
  async messageRecall(@GetUser() { sub }, @Param('id') id: string) {
    return this.messageService.messageRecall(sub, id);
  }
}
