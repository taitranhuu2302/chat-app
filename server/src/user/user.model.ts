import {
  Prop,
  SchemaFactory,
  Schema as SchemaDecorator,
} from '@nestjs/mongoose';
import { BaseEntity } from '../shared/base/base.entity';
import { HydratedDocument, Schema } from 'mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;
export type UserFriendDocument = HydratedDocument<UserFriend>;
export type UserRequestFriendDocument = HydratedDocument<UserRequestFriend>;

@SchemaDecorator({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User extends BaseEntity {
  @Prop({ isRequired: true, unique: true })
  email: string;
  @Prop({ isRequired: true })
  @Exclude()
  password: string;
  @Prop()
  bio: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  phone: string;
  @Prop()
  address: string;
  @Prop()
  avatar: string;
  @Prop({ type: [{ type: Schema.Types.ObjectId, ref: 'UserFriend' }] })
  friends: UserFriend[];
  @Prop({ type: [{ type: Schema.Types.ObjectId, ref: 'UserRequestFriend' }] })
  requestFriend: UserRequestFriend[];
}

@SchemaDecorator({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class UserFriend extends BaseEntity {
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  userId: string;
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  friendId: string;
}

export enum RequestFriendEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@SchemaDecorator({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class UserRequestFriend extends BaseEntity {
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  senderId: string;
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  receiverId: string;
  @Prop({ default: RequestFriendEnum.PENDING })
  status: RequestFriendEnum;
}

export const UserFriendSchema = SchemaFactory.createForClass(UserFriend);
export const UserRequestFriendSchema =
  SchemaFactory.createForClass(UserRequestFriend);
export const UserSchema = SchemaFactory.createForClass(User);
