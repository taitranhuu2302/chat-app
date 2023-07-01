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
import { Conversation } from '../conversation/conversation.model';
import { ConversationDto } from '../conversation/dto/conversation.dto';

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
    if (
      (!files || !files.length) &&
      !dto.text &&
      (!dto.gifs || !dto.gifs.length)
    )
      throw new BadRequestException('Please enter content');
    const messages: MessageDto[] = [];

    if (dto.text) {
      const message = await this.messageModel.create({
        text: dto.text,
        conversation: dto.conversation,
        sender: sub,
      });
      await message.populate(['sender']);
      const mapped = plainToClass(MessageDto, message, {
        excludeExtraneousValues: true,
      });
      messages.push(mapped);
    }

    if (!!files.length) {
      for (const file of files) {
        const newMessage = await this.messageModel.create({
          file: `${process.env.SERVER_URL}/uploads/message/${file.filename}`,
          conversation: dto.conversation,
          sender: sub,
        });
        await newMessage.populate(['sender']);
        const messageMapped = plainToClass(MessageDto, newMessage, {
          excludeExtraneousValues: true,
        });
        messages.push(messageMapped);
      }
    }
    if (!!dto.gifs) {
      const gifsToArray = Array.isArray(dto.gifs) ? dto.gifs : [dto.gifs];
      for (const gif of gifsToArray) {
        const newMessage = await this.messageModel.create({
          file: gif,
          conversation: dto.conversation,
          sender: sub,
        });
        await newMessage.populate(['sender']);
        const messageMapped = plainToClass(MessageDto, newMessage, {
          excludeExtraneousValues: true,
        });
        messages.push(messageMapped);
      }
    }

    this.socketService.socket
      .to(dto.conversation)
      .emit(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, messages);

    return messages;
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
    const message = await this.messageModel
      .findOneAndDelete({
        sender: sub,
        _id: id,
      })
      .populate('conversation');

    if (!message) {
      throw new BadRequestException('Message not found');
    }
    const messageMapped = plainToClass(MessageDto, message, {
      excludeExtraneousValues: true,
    });
    console.log(messageMapped);

    this.socketService.socket
      .to((messageMapped.conversation as ConversationDto)._id.toString())
      .emit(SOCKET_EVENT.MESSAGE.MESSAGE_RECALL, messageMapped);

    return messageMapped;
  }
}
