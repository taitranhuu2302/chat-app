import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { RedisModule } from '../redis/redis.module';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.model';
import {
  Conversation,
  ConversationSchema,
} from '../conversation/conversation.model';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  providers: [SocketService, SocketGateway, JwtService],
  exports: [SocketService],
})
export class SocketModule {}
