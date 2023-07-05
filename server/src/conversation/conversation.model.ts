import {
  Prop,
  SchemaFactory,
  Schema as SchemaDecorator,
} from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { BaseEntity } from 'src/shared/base/base.entity';
import { User } from 'src/user/user.model';

export type ConversationDocument = HydratedDocument<Conversation>;

export enum ConversationType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

@SchemaDecorator({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Conversation extends BaseEntity {
  @Prop({ type: Schema.Types.ObjectId, ref: 'User' })
  owner: User;
  @Prop({ type: String, required: false })
  conversationName: string;
  @Prop({ type: String, required: false })
  avatar: string;
  @Prop({ default: ConversationType.PRIVATE })
  conversationType: ConversationType;
  @Prop({ type: [{ type: Schema.Types.ObjectId, ref: 'User' }] })
  members: User[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
