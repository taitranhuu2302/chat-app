import { User } from '../../user/user.model';
import { Message, MessageType } from '../message.model';
import { Expose, Transform, Type } from 'class-transformer';
import { ConversationDto } from '../../conversation/dto/conversation.dto';
import { UserDto } from '../../user/dto/user.dto';
import {BaseMapEntity} from "../../shared/base/base-map.entity";
import { ReactionDto } from 'src/reactions/dto/reaction.dto';

export class MessageDto extends BaseMapEntity{
  @Expose()
  @Transform(({ value }) => value || null)
  text?: string;
  @Expose()
  @Transform(({ value }) => value || null)
  @Type(() => MessageDto)
  reply?: Message | string;
  @Expose()
  @Transform(({ value }) => value || null)
  song?: string;
  @Expose()
  @Transform(({ value }) => value || null)
  @Type(() => ConversationDto)
  conversation: ConversationDto | string;
  @Expose()
  @Transform(({ value }) => value || null)
  @Type(() => UserDto)
  sender: User | string;
  @Expose()
  @Transform(({ value }) => value || null)
  @Type(() => ReactionDto)
  reactions: ReactionDto[];
  @Expose()
  @Transform(({ value }) => value || null)
  messageType: MessageType;
  @Expose()
  @Transform(({ value }) => value || null)
  file: string;
  @Expose()
  @Transform(({ value }) => value || null)
  isEdit: boolean;
  @Expose()
  @Transform(({ value }) => value || null)
  dateRead: Date;
}
