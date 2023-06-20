import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
  ConversationType,
} from './conversation.model';
import { Model, Schema } from 'mongoose';
import {
  PaginationOptions,
  paginate,
} from 'src/shared/helper/pagination.helper';
import { plainToClass } from 'class-transformer';
import { ConversationDto } from './dto/conversation.dto';
import { ConversationCreateDto } from './dto/conversation-create.dto';
import { User, UserDocument } from 'src/user/user.model';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findAll(sub: string, options: PaginationOptions) {
    return await paginate(
      this.conversationModel
        .find({ members: sub })
        .populate(['owner', 'members']),
      options,
      async (data) => {
        const formattedData = [];

        for (const item of data) {
          const conversation = plainToClass(ConversationDto, item, {
            excludeExtraneousValues: true,
          });
          if (item.conversationType === ConversationType.PRIVATE) {
            const userOther = conversation.members.find((m) => m._id !== sub);
            const name =
              conversation.conversationType === ConversationType.GROUP
                ? conversation.conversationName
                : `${userOther.firstName} ${userOther.lastName}`;

            formattedData.push({
              ...conversation,
              conversationName: name,
            });
            continue;
          }

          formattedData.push(conversation);
        }

        return formattedData;
      },
    );
  }

  async create(sub: string, dto: ConversationCreateDto) {
    const newConversation = await this.conversationModel.create({
      conversationName: dto.conversationName,
      conversationType: dto.conversationType,
      owner: dto.conversationType === ConversationType.GROUP ? sub : null,
      members: [...dto.members, sub],
    });

    // await this.userModel.updateMany(
    //   { _id: { $in: dto.members } },
    //   { $push: { conversations: newConversation._id } },
    // );

    return plainToClass(ConversationDto, newConversation, {
      excludeExtraneousValues: true,
    });
  }
}
