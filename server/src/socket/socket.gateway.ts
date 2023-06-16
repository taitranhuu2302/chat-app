import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.model';
import { Model } from 'mongoose';

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
  ) {}

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  async handleConnection(socket: Socket, ...args: any[]): Promise<any> {
    this.logger.log(`Client connected: ${socket.id}`);

    const user = await this.getUser(socket);
    if (!user) return;
    await this.redisService.setSocketId(user._id.toString(), socket.id);
  }

  async handleDisconnect(socket: Socket): Promise<any> {
    this.logger.log(`Client disconnected: ${socket.id}`);
    const user = await this.getUser(socket);
    if (!user) return;
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
}
