import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.model';
import { SocketModule } from '../socket/socket.module';
import { RedisModule } from '../redis/redis.module';
import {
  Conversation,
  ConversationSchema,
} from '../conversation/conversation.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    SocketModule,
    RedisModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
