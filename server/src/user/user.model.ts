import {
  Prop,
  SchemaFactory,
  Schema as SchemaDecorator,
} from '@nestjs/mongoose';
import { BaseEntity } from '../shared/base/base.entity';
import { HydratedDocument, Schema } from 'mongoose';
import { Exclude, Expose } from 'class-transformer';

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
  @Expose()
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
  githubLink: string;
  @Prop()
  facebookLink: string;
  @Prop()
  avatar: string;
  @Prop({type: Boolean, default: false})
  isNoPassword: boolean;
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
  user: User;
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  friend: User;
  @Prop()
  isBlock: boolean;
}

@SchemaDecorator({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class UserRequestFriend extends BaseEntity {
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  sender: User;
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  receiver: User;
  @Prop({ type: Boolean, default: false })
  isRead: boolean;
}

const UserFriendSchema = SchemaFactory.createForClass(UserFriend);
const UserRequestFriendSchema = SchemaFactory.createForClass(UserRequestFriend);
const UserSchema = SchemaFactory.createForClass(User);

export { UserFriendSchema, UserRequestFriendSchema, UserSchema };
