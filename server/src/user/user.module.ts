import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserFriend,
  UserFriendSchema,
  UserRequestFriend,
  UserRequestFriendSchema,
  UserSchema,
} from './user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserFriend.name, schema: UserFriendSchema },
      { name: UserRequestFriend.name, schema: UserRequestFriendSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
