import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
  ConversationType,
} from './conversation.model';
import { Model } from 'mongoose';
import {
  paginate,
  PaginationOptions,
} from 'src/shared/helper/pagination.helper';
import { plainToClass } from 'class-transformer';
import { ConversationDto } from './dto/conversation.dto';
import { ConversationCreateDto } from './dto/conversation-create.dto';
import { User, UserDocument } from 'src/user/user.model';
import { ConversationUpdateDto } from './dto/conversation-update.dto';
import { ConversationAddMemberDto } from './dto/conversation-add-member.dto';
import {
  Message,
  MessageDocument,
  MessageType,
} from '../message/message.model';
import { MessageDto } from '../message/dto/message.dto';
import { SocketService } from '../socket/socket.service';
import { RedisService } from '../redis/redis.service';
import { SOCKET_EVENT } from '../shared/constants/socket.constant';
import { ConversationRemoveMemberDto } from './dto/conversation-remove-member.dto';
import { handleDecoding } from 'src/shared/helper/cryptography';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    private socketService: SocketService,
    private redisService: RedisService,
  ) {}

  async getAllFile(sub: string, conversationId: string) {
    return await this.messageModel.find({
      text: null,
      conversation: conversationId,
    })
  }

  async findAll(sub: string, options: PaginationOptions) {
    return await paginate(
      this.conversationModel
        .find(
          { members: sub, deletedAt: null },
          {},
          {
            sort: { updatedAt: -1 },
          },
        )
        .populate(['owner', 'members']),
      options,
      async (data) => {
        const formattedData = [];

        for (const item of data) {
          const conversation = plainToClass(ConversationDto, item, {
            excludeExtraneousValues: true,
          });
          const latestMessage = plainToClass(
            MessageDto,
            await this.messageModel.findOne(
              { conversation: conversation._id },
              {},
              {
                sort: { createdAt: -1 },
              },
            ),
            { excludeExtraneousValues: true },
          );

          latestMessage.text = handleDecoding(latestMessage.text)

          if (item.conversationType === ConversationType.PRIVATE) {
            const userOther = conversation.members.find((m) => {
              return m._id.toString() !== sub;
            });
            const name = `${userOther.firstName} ${userOther.lastName}`;

            formattedData.push({
              ...conversation,
              conversationName: name,
              avatar: userOther.avatar,
              latestMessage,
            });
            continue;
          }
          formattedData.push({ ...conversation, latestMessage });
        }

        return formattedData;
      },
    );
  }

  async create(sub: string, dto: ConversationCreateDto) {
    if (dto.conversationType === ConversationType.PRIVATE) {
      const friendId = dto.members[0];
      const checkConversation = await this.conversationModel.findOne({
        $or: [
          { members: { $all: [sub, friendId] } },
          { members: { $all: [friendId, sub] } },
        ],
        $and: [{ conversationType: ConversationType.PRIVATE }],
      });

      if (checkConversation) {
        return plainToClass(ConversationDto, checkConversation, {
          excludeExtraneousValues: true,
        });
      }
    }
    const newConversation = await this.conversationModel.create({
      conversationName: dto.conversationName,
      conversationType: dto.conversationType,
      owner: dto.conversationType === ConversationType.GROUP ? sub : null,
      members: [...dto.members, sub],
    });
    const conversationResponse = await this.findById(
      sub,
      newConversation._id.toString(),
    );

    for (const member of dto.members) {
      this.socketService.socket.socketsJoin(newConversation._id.toString());
      const client = await this.redisService.getSocketId(member);
      this.socketService.socket
        .to(client)
        .emit(
          SOCKET_EVENT.CONVERSATION.CREATE_CONVERSATION,
          conversationResponse,
        );
    }

    return plainToClass(ConversationDto, newConversation, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    sub: string,
    conversationId: string,
    dto: ConversationUpdateDto,
  ) {
    const currentUser = await this.userModel.findById(sub);
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      members: sub,
    });
    if (!conversation) throw new ForbiddenException('You are not authorized');
    if (conversation.conversationType === ConversationType.PRIVATE)
      throw new BadRequestException('Private rooms cannot be renamed');

    conversation.conversationName = dto.conversationName;
    conversation.save();

    const message = await this.messageModel.create({
      text: `${currentUser.firstName} ${currentUser.lastName} changed the chat name to ${dto.conversationName}`,
      conversation: conversation._id,
      messageType: MessageType.NOTIFY,
    });
    this.socketService.socket
      .to(conversation._id.toString())
      .emit(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, [message]);

    this.socketService.socket
      .to(conversation._id.toString())
      .emit(SOCKET_EVENT.CONVERSATION.UPDATE_CONVERSATION, conversation);

    return conversation;
  }

  async findById(sub: string, id: string) {
    const conversation = await this.conversationModel
      .findById(id)
      .populate(['owner', 'members']);
    if (!conversation) throw new BadRequestException('Conversation not found');
    const mapped = plainToClass(ConversationDto, conversation, {
      excludeExtraneousValues: true,
    });
    if (mapped.conversationType === ConversationType.PRIVATE) {
      const userOther = mapped.members.find((m) => m._id.toString() !== sub);
      const name = `${userOther.firstName} ${userOther.lastName}`;

      return {
        ...mapped,
        conversationName: name,
        avatar: userOther.avatar,
      };
    }

    return mapped;
  }

  async changeAvatar(sub: string, id: string, file: Express.Multer.File) {
    const currentUser = await this.userModel.findById(sub);
    if (!file) {
      throw new BadRequestException('No avatar files provided');
    }
    const conversation = await this.conversationModel.findById(id);
    if (!conversation) throw new BadRequestException('Room not found');
    if (conversation.conversationType === ConversationType.PRIVATE)
      throw new BadRequestException(
        'Conversation private cannot change avatar',
      );

    conversation.avatar = `${process.env.SERVER_URL}/uploads/conversation/${file.filename}`;
    conversation.save();

    const message = await this.messageModel.create({
      text: `${currentUser.firstName} ${currentUser.lastName} changed photo of conversation`,
      conversation: conversation._id,
      messageType: MessageType.NOTIFY,
    });
    this.socketService.socket
      .to(conversation._id.toString())
      .emit(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, [message]);

    this.socketService.socket
      .to(conversation._id.toString())
      .emit(SOCKET_EVENT.CONVERSATION.UPDATE_CONVERSATION, conversation);
    return conversation;
  }

  async addMembers(sub: string, dto: ConversationAddMemberDto) {
    const conversation = await this.conversationModel.findOne({
      _id: dto.conversationId,
      members: sub,
    });
    const currentUser = await this.userModel.findById(sub);
    for (const memberId of dto.members) {
      const newMember = await this.userModel.findById(memberId);
      if (
        !newMember ||
        conversation.members.some((m: any) => m.toString() === memberId)
      )
        continue;
      conversation.members.push(newMember);
      const message = await this.messageModel.create({
        text: `${currentUser.firstName} ${currentUser.lastName} added ${newMember.lastName} to the group`,
        conversation: conversation._id,
        messageType: MessageType.NOTIFY,
      });
      this.socketService.socket
        .to(conversation._id.toString())
        .emit(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, [message]);
    }
    conversation.save();

    this.socketService.socket
      .to(conversation._id.toString())
      .emit(SOCKET_EVENT.CONVERSATION.UPDATE_CONVERSATION, conversation);

    return conversation;
  }

  async removeMember(sub: string, dto: ConversationRemoveMemberDto) {
    const conversation = await this.conversationModel
      .findOne({
        _id: dto.conversationId,
        members: { $in: [sub, dto.userId] },
      })
      .populate(['owner']);
    if (!conversation) throw new BadRequestException('Conversation not found');
    const user = dto.userId ? await this.userModel.findById(dto.userId) : null;
    const currentUser = await this.userModel.findById(sub);

    if (dto.userId) {
      // Remove user
      if (conversation.owner._id.toString() !== sub)
        throw new ForbiddenException('you are not authorized');

      conversation.members = conversation.members.filter(
        (m) => m._id.toString() !== dto.userId,
      );

      const message = this.messageModel.create({
        text: `${currentUser.firstName} ${currentUser.lastName} removed ${user.lastName} from the group`,
        conversation: conversation._id,
        messageType: MessageType.NOTIFY,
      });

      this.socketService.socket
        .to(conversation._id.toString())
        .emit(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, [message]);
    } else {
      // Leave conversation
      if (conversation.owner._id.toString() !== sub) {
        // Leave conversation
        conversation.members = conversation.members.filter(
          (m) => m._id.toString() !== sub,
        );

        const message = this.messageModel.create({
          text: `${currentUser.firstName} ${currentUser.lastName} has left the group`,
          conversation: conversation._id,
          messageType: MessageType.NOTIFY,
        });

        this.socketService.socket
          .to(conversation._id.toString())
          .emit(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, [message]);
      } else {
        // Delete conversation
        conversation.deletedAt = new Date();
      }
    }

    conversation.save();

    this.socketService.socket
      .to(conversation._id.toString())
      .emit(SOCKET_EVENT.CONVERSATION.UPDATE_CONVERSATION, conversation);

    return conversation;
  }
}
