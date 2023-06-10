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
  user: Schema.Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  friend: Schema.Types.ObjectId;
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
  sender: Schema.Types.ObjectId;
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  receiver: Schema.Types.ObjectId;
}

const UserFriendSchema = SchemaFactory.createForClass(UserFriend);
const UserRequestFriendSchema = SchemaFactory.createForClass(UserRequestFriend);
const UserSchema = SchemaFactory.createForClass(User);

export { UserFriendSchema, UserRequestFriendSchema, UserSchema };
