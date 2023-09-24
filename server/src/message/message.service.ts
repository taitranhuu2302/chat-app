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
import { ConversationDto } from '../conversation/dto/conversation.dto';
import {
  Conversation,
  ConversationDocument,
} from '../conversation/conversation.model';
import { handleDecoding, handleEncoding } from 'src/shared/helper/cryptography';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
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
        .find({
          conversation: id,
        })
        .sort({ createdAt: -1 })
        .populate({ path: 'sender' })
        .populate({ path: 'conversation' })
        .populate({ path: 'reactions', populate: { path: 'user' } })
        .populate({ path: 'reply', populate: { path: 'sender' } }),
      options,
      async (data) => {
        const formattedData = [];

        for (const item of data) {
          const message = plainToClass(MessageDto, item, {
            excludeExtraneousValues: true,
          });
          
          message.text = handleDecoding(message.text ?? "")
          if (message.reply && typeof message.reply !== 'string' && !!message.reply.text) {
            message.reply.text = handleDecoding(message.reply.text ?? "")
          }
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
      (!dto.gifs || !dto.gifs.length) &&
      (!dto.songs || !dto.songs.length)
    )
      throw new BadRequestException('Please enter content');
    const messages: MessageDto[] = [];

    const conversation = await this.conversationModel.findById(
      dto.conversation,
    );

    if (!conversation) throw new BadRequestException('Conversation not found');

    if (dto.text) {
      let message = null;
      const text = handleEncoding(dto.text)
      if (dto.reply) {
        message = await this.messageModel.create({
          text: text,
          conversation: dto.conversation,
          sender: sub,
          reply: dto.reply,
        });
      } else {
        message = await this.messageModel.create({
          text: text,
          conversation: dto.conversation,
          sender: sub,
        });
      }
      await message.populate({
        path: 'reply',
        populate: {
          path: 'sender',
        },
      });
      await message.populate('sender');
      const mapped = plainToClass(MessageDto, message, {
        excludeExtraneousValues: true,
      });
      mapped.text = handleDecoding(mapped.text)
      if (mapped.reply && typeof mapped.reply !== 'string' && !!mapped.reply.text) {
        mapped.reply.text = handleDecoding(mapped.reply.text ?? "")
      }
      messages.push(mapped);
    }

    if (!!files.length) {
      for (const file of files) {
        let newMessage = null;
        if (dto.reply) {
          newMessage = await this.messageModel.create({
            file: `${process.env.SERVER_URL}/uploads/message/${file.filename}`,
            conversation: dto.conversation,
            sender: sub,
            reply: dto.reply,
          });
        } else {
          newMessage = await this.messageModel.create({
            file: `${process.env.SERVER_URL}/uploads/message/${file.filename}`,
            conversation: dto.conversation,
            sender: sub,
          });
        }
        await newMessage.populate({
          path: 'reply',
          populate: {
            path: 'sender',
          },
        });
        await newMessage.populate('sender');
        const messageMapped = plainToClass(MessageDto, newMessage, {
          excludeExtraneousValues: true,
        });
        if (messageMapped.reply && typeof messageMapped.reply !== 'string' && !!messageMapped.reply.text) {
          messageMapped.reply.text = handleDecoding(messageMapped.reply.text ?? "")
        }
        messages.push(messageMapped);
      }
    }
    if (!!dto.gifs) {
      const gifsToArray = Array.isArray(dto.gifs) ? dto.gifs : [dto.gifs];
      for (const gif of gifsToArray) {
        let newMessage = null;
        if (dto.reply) {
          newMessage = await this.messageModel.create({
            file: gif,
            conversation: dto.conversation,
            sender: sub,
            reply: dto.reply,
          });
        } else {
          newMessage = await this.messageModel.create({
            file: gif,
            conversation: dto.conversation,
            sender: sub,
          });
        }

        await newMessage.populate({
          path: 'reply',
          populate: {
            path: 'sender',
          },
        });
        await newMessage.populate('sender');
        const messageMapped = plainToClass(MessageDto, newMessage, {
          excludeExtraneousValues: true,
        });
        if (messageMapped.reply && typeof messageMapped.reply !== 'string' && !!messageMapped.reply.text) {
          messageMapped.reply.text = handleDecoding(messageMapped.reply.text ?? "")
        }
        messages.push(messageMapped);
      }
    }

    if (!!dto.songs) {
      const songToArray = Array.isArray(dto.songs) ? dto.songs : [dto.songs];
      for (const song of songToArray) {
        let newMessage = null;
        if (dto.reply) {
          newMessage = await this.messageModel.create({
            song: song,
            conversation: dto.conversation,
            sender: sub,
            reply: dto.reply,
          });
        } else {
          newMessage = await this.messageModel.create({
            song: song,
            conversation: dto.conversation,
            sender: sub,
          });
        }

        await newMessage.populate({
          path: 'reply',
          populate: {
            path: 'sender',
          },
        });
        await newMessage.populate('sender');
        const messageMapped = plainToClass(MessageDto, newMessage, {
          excludeExtraneousValues: true,
        });
        if (messageMapped.reply && typeof messageMapped.reply !== 'string' && !!messageMapped.reply.text) {
          messageMapped.reply.text = handleDecoding(messageMapped.reply.text ?? "")
        }
        messages.push(messageMapped);
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    conversation.updatedAt = new Date();
    await conversation.save();

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

    this.socketService.socket
      .to((messageMapped.conversation as ConversationDto)._id.toString())
      .emit(SOCKET_EVENT.MESSAGE.MESSAGE_RECALL, messageMapped);

    return messageMapped;
  }
}
