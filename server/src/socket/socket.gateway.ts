import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.model';
import { Model } from 'mongoose';
import { SOCKET_EVENT } from 'src/shared/constants/socket.constant';
import {
  Conversation,
  ConversationDocument,
} from 'src/conversation/conversation.model';
import { UserDto } from 'src/user/dto/user.dto';

@WebSocketGateway({ cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('SocketGateway');

  constructor(
    private socketService: SocketService,
    private redisService: RedisService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  async handleConnection(socket: Socket): Promise<any> {
    this.logger.log(`Client connected: ${socket.id}`);

    const user = await this.getUser(socket);
    if (!user) return;
    await this.redisService.setSocketId(user._id.toString(), socket.id);
    const conversations = await this.conversationModel.find({
      members: user._id,
    });
    conversations.forEach((c) => socket.join(c._id.toString()));

    const sockets = await this.redisService.getAllSocket();

    this.socketService.socket.emit(SOCKET_EVENT.USER_CONNECTED, sockets);
  }

  async handleDisconnect(socket: Socket): Promise<any> {
    this.logger.log(`Client disconnected: ${socket.id}`);

    const sockets = await this.redisService.getAllSocket();

    this.socketService.socket.emit(SOCKET_EVENT.USER_CONNECTED, sockets);

    const user = await this.getUser(socket);
    if (!user) return;

    const conversations = await this.conversationModel.find({
      members: user._id,
    });
    conversations.forEach((c) => socket.leave(c._id.toString()));

    await this.redisService.removeSocketId(user._id.toString());
  }

  async getUser(socket: Socket): Promise<UserDocument | null> {
    const token = socket.handshake.headers.authorization;
    const bearerToken = token?.split(' ')[1];
    if (!bearerToken) return null;
    const decoded = this.jwtService.decode(bearerToken);
    const user = await this.userModel.findById(decoded.sub);
    if (!user) return null;

    return user;
  }

  @SubscribeMessage(SOCKET_EVENT.USER_TYPING)
  async handleUserTyping(
    @MessageBody()
    data: {
      user: UserDto;
      conversationId: string;
      text: string;
    },
  ) {
    if (data.text) {
      this.server.to(data.conversationId).emit(SOCKET_EVENT.USER_IS_TYPING, {
        user: data.user,
        conversationId: data.conversationId,
        isTyping: true,
      });
    } else {
      this.server.to(data.conversationId).emit(SOCKET_EVENT.USER_IS_TYPING, {
        user: data.user,
        conversationId: data.conversationId,
        isTyping: false,
      });
    }
    return null;
  }

  @SubscribeMessage(SOCKET_EVENT.VIDEO.JOIN)
  async handleVideoCalling(
    @MessageBody() data: any,
  ) {
    // TODO implement video calling logic here
    this.server.to(data.conversationId).emit(SOCKET_EVENT.VIDEO.CALLING, {
      ...data,
    })
  }

  @SubscribeMessage(SOCKET_EVENT.VIDEO.USER_DISCONNECTED)
  async handleVideoDisconnected(@MessageBody() data: any) {
    console.log(data);
    this.server.to(data.conversationId).emit(SOCKET_EVENT.VIDEO.DISCONNECTED, data)
  }
}
