import {
  Prop,
  SchemaFactory,
  Schema as SchemaDecorator,
} from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { BaseEntity } from 'src/shared/base/base.entity';
import { Conversation } from '../conversation/conversation.model';
import { User } from '../user/user.model';
import { Optional } from '@nestjs/common';

export type MessageDocument = HydratedDocument<Message>;

export enum MessageType {
  DEFAULT = 'DEFAULT',
  NOTIFY = 'NOTIFY',
}

@SchemaDecorator({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Message extends BaseEntity {
  @Prop()
  text?: string;
  @Prop({ type: Schema.Types.ObjectId, ref: 'Message' })
  reply?: Message | string;
  @Prop({ type: Schema.Types.ObjectId, ref: 'Conversation' })
  conversation: Conversation | string;
  @Prop({ type: Schema.Types.ObjectId, ref: 'User' })
  sender: User | string;
  @Prop({ default: MessageType.DEFAULT })
  messageType: MessageType;
  @Prop()
  file: string;
  @Prop()
  isEdit: boolean;
  @Prop()
  dateRead: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
