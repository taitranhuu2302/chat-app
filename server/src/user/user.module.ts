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
import { SocketModule } from '../socket/socket.module';
import { RedisModule } from '../redis/redis.module';
import { NotifyModule } from 'src/notify/notify.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserFriend.name, schema: UserFriendSchema },
      { name: UserRequestFriend.name, schema: UserRequestFriendSchema },
    ]),
    SocketModule,
    RedisModule,
    NotifyModule
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
