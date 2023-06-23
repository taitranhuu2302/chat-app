import { BadRequestException, Injectable } from '@nestjs/common';
import {
  paginate,
  PaginationOptions,
} from '../shared/helper/pagination.helper';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument, MessageType } from './message.model';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { MessageDto } from './dto/message.dto';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageUpdateDto } from './dto/message-update.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
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
    console.log(files);
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

    return plainToClass(MessageDto, message, { excludeExtraneousValues: true });
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
