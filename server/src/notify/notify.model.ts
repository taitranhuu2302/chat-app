import { BaseEntity } from '../shared/base/base.entity';
import {
  Prop,
  Schema as SchemaDecorator,
  SchemaFactory,
} from '@nestjs/mongoose';
import { User, UserFriend, UserRequestFriend } from '../user/user.model';
import { HydratedDocument, Schema } from 'mongoose';

export enum NotifyEnum {
  USER_FRIEND = 'USER_FRIEND',
  USER_REQUEST_FRIEND = 'USER_REQUEST_FRIEND',
  DEFAULT = "DEFAULT"
}

export type NotifyDocument = HydratedDocument<NotifyModel>;

@SchemaDecorator({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class NotifyModel extends BaseEntity {
  @Prop({ required: true })
  title: string;
  @Prop()
  description: string;
  @Prop({ required: true, default: NotifyEnum.DEFAULT })
  type: NotifyEnum;
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  owner: User;
  @Prop({ type: Schema.Types.ObjectId, ref: UserFriend.name })
  userFriend: UserFriend;
  @Prop({ type: Schema.Types.ObjectId, ref: UserRequestFriend.name })
  userRequestFriend: UserRequestFriend;
}

export const NotifySchema = SchemaFactory.createForClass(NotifyModel);
