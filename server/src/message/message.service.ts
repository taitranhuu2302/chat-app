import { BadRequestException, Injectable } from '@nestjs/common';
import {
  paginate,
  PaginationOptions,
} from '../shared/helper/pagination.helper';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.model';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { MessageDto } from './dto/message.dto';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageUpdateDto } from './dto/message-update.dto';
import { SocketService } from '../socket/socket.service';
import { RedisService } from '../redis/redis.service';
import { SOCKET_EVENT } from '../shared/constants/socket.constant';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private socketService: SocketService,
    private redisService: RedisService,
  ) {}

  async findAllByConversation(
    sub: string,
    id: string,
    options: PaginationOptions,
  ) {
    return paginate(
      this.messageModel
        .find(
          {
            conversation: id,
          },
          {},
          { sort: { createdAt: -1 } },
        )
        .populate(['sender', 'conversation']),
      options,
      async (data) => {
        const formattedData = [];

        for (const item of data) {
          const message = plainToClass(MessageDto, item, {
            excludeExtraneousValues: true,
          });
          formattedData.push(message);
        }

        return formattedData;
      },
    );
  }

  async create(
    sub: string,
    files: Array<Express.Multer.File>,
    dto: MessageCreateDto,
  ) {
    if ((!files || !files.length) && !dto.text)
      throw new BadRequestException('Please enter content');

    const message = await this.messageModel.create({
      files: files.map(
        (file) => `${process.env.SERVER_URL}/uploads/message/${file.filename}`,
      ),
      text: dto.text,
      conversation: dto.conversation,
      sender: sub,
    });

    await message.populate(['sender']);

    const mapped = plainToClass(MessageDto, message, {
      excludeExtraneousValues: true,
    });

    this.socketService.socket
      .to(dto.conversation)
      .emit(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, mapped);

    return mapped;
  }

  async update(sub: string, messageId: string, dto: MessageUpdateDto) {
    const message = await this.messageModel.findOne({
      sender: sub,
      _id: messageId,
    });
    if (!message) throw new BadRequestException('Message not found');
    message.text = dto.text ?? message.text;
    message.save();

    return message;
  }

  async messageRecall(sub: string, id: string) {
    const message = await this.messageModel.findOneAndDelete({
      sender: sub,
      _id: id,
    });

    if (!message) {
      throw new BadRequestException('Message not found');
    }

    return message;
  }
}
