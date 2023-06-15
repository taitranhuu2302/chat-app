import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { plainToClass } from 'class-transformer';
import { Model, Schema } from 'mongoose';
import { RedisService } from '../redis/redis.service';
import { SOCKET_EVENT } from '../shared/constants/socket.constant';
import {
  PaginationOptions,
  paginate,
} from '../shared/helper/pagination.helper';
import { SocketService } from '../socket/socket.service';
import { FriendRequestDto } from './dto/friend-request.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserDto } from './dto/user.dto';
import {
  User,
  UserDocument,
  UserFriend,
  UserFriendDocument,
  UserRequestFriend,
  UserRequestFriendDocument,
} from './user.model';
import { NotifyService } from 'src/notify/notify.service';
import { NotifyEnum } from 'src/notify/notify.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserFriend.name)
    private userFriendModel: Model<UserFriendDocument>,
    @InjectModel(UserRequestFriend.name)
    private userRequestFriendModel: Model<UserRequestFriendDocument>,
    private socketService: SocketService,
    private redisService: RedisService,
    private notifyService: NotifyService,
  ) {}

  async index(sub: string, options: PaginationOptions) {
    return await paginate(this.userModel.find(), options, async (data) => {
      const formattedData = [];
      for (const u of data) {
        const userDto = plainToClass(UserDto, u, {
          excludeExtraneousValues: true,
        });
        const currentUser = await this.getCurrentUser(sub, userDto._id);
        const formattedUser = {
          ...userDto,
          ...currentUser,
        };
        formattedData.push(formattedUser);
      }
      return formattedData;
    });
  }

  async searchUser(sub: string, options: PaginationOptions, keywords: string) {
    delete options.search;

    const regex = new RegExp(keywords, 'i');
    return await paginate(
      this.userModel.find({
        $or: [
          { email: { $regex: regex } },
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
        ],
      }),
      options,
      async (data) => {
        const formattedData = [];
        for (const u of data) {
          const userDto = plainToClass(UserDto, u, {
            excludeExtraneousValues: true,
          });
          const currentUser = await this.getCurrentUser(sub, userDto._id);
          const formattedUser = {
            ...userDto,
            ...currentUser,
          };
          formattedData.push(formattedUser);
        }
        return formattedData;
      },
    );
  }

  async getCurrentUser(
    sub: string | Schema.Types.ObjectId,
    userId: string | Schema.Types.ObjectId,
  ) {
    const isFriend = await this.isFriend(sub, userId);
    const isRequestSent = await this.isRequestFriend(sub, userId);
    const isRequestReceived = await this.isRequestFriend(userId, sub);

    return {
      currentUser: {
        isFriend,
        isRequestSent,
        isRequestReceived,
      },
    };
  }

  async isFriend(
    userId: string | Schema.Types.ObjectId,
    friendId: string | Schema.Types.ObjectId,
  ) {
    const friends = await this.userFriendModel.find({
      $or: [
        {
          user: userId,
          friend: friendId,
        },
        {
          user: friendId,
          friend: userId,
        },
      ],
    });

    return friends.length >= 2;
  }

  async unFriend(sub: string, friendId: string) {
    const isFriend = await this.isFriend(sub, friendId);
    if (!isFriend) throw new BadRequestException('You two are not friends');

    const userCurrent = await this.userModel.findById(sub);

    await this.userFriendModel.findOneAndDelete({
      user: sub,
      friend: friendId,
    });

    await this.userFriendModel.findOneAndDelete({
      user: friendId,
      friend: sub,
    });

    const client = await this.redisService.getSocketId(friendId);

    if (client) {
      const mapped = plainToClass(UserDto, userCurrent, {
        excludeExtraneousValues: true,
      });

      this.socketService.socket
        .to(client)
        .emit(SOCKET_EVENT.USER.UN_FRIEND, mapped);
    }

    return null;
  }

  async acceptFriendRequest(sub: string, dto: FriendRequestDto) {
    if (sub !== dto.receiverId)
      throw new ForbiddenException('You are not authorized');

    const receiver = await this.userModel.findById(dto.receiverId);
    const sender = await this.userModel.findById(dto.senderId);

    if (!sender || !receiver) throw new BadRequestException('User not found');

    if (await this.isFriend(dto.receiverId, dto.senderId))
      throw new BadRequestException('You two are already friends');

    await this.userRequestFriendModel.findOneAndDelete({
      sender: sender._id,
      receiver: receiver._id,
      deletedAt: null,
    });

    await this.userFriendModel.create({
      user: sender._id,
      friend: receiver._id,
    });
    await this.userFriendModel.create({
      user: receiver._id,
      friend: sender._id,
    });

    const client = await this.redisService.getSocketId(dto.senderId);
    if (client) {
      const mapped = plainToClass(UserDto, receiver, {
        excludeExtraneousValues: true,
      });
      this.socketService.socket
        .to(client)
        .emit(SOCKET_EVENT.USER.ACCEPT_FRIEND_REQUEST, mapped);
    }

    await this.notifyService.createNotify({
      owner: sender._id.toString(),
      title: `${receiver.firstName} ${receiver.lastName} accepted the friend request`,
      type: NotifyEnum.DEFAULT,
    });

    return null;
  }

  async rejectFriendRequest(sub: string, dto: FriendRequestDto) {
    if (sub !== dto.receiverId && sub !== dto.senderId)
      throw new ForbiddenException('You are not authorized');

    const receiver = await this.userModel.findById(dto.receiverId);
    const sender = await this.userModel.findById(dto.senderId);

    if (!sender || !receiver) throw new BadRequestException('User not found');

    await this.userRequestFriendModel.findOneAndDelete({
      sender: sender._id,
      receiver: receiver._id,
      deletedAt: null,
    });

    const client = await this.redisService.getSocketId(dto.senderId);

    if (client) {
      const mapped = plainToClass(UserDto, receiver, {
        excludeExtraneousValues: true,
      });
      this.socketService.socket
        .to(client)
        .emit(SOCKET_EVENT.USER.REJECT_FRIEND_REQUEST, mapped);
    }

    await this.notifyService.createNotify({
      owner: sender._id.toString(),
      title: `${receiver.firstName} ${receiver.lastName} declined the friend request`,
      type: NotifyEnum.DEFAULT,
    });

    return null;
  }

  async getFriends(sub: string, options: PaginationOptions) {
    return await paginate(
      this.userFriendModel
        .find({
          user: sub,
          deletedAt: null,
        })
        .populate('friend'),
      options,
      async (data) => {
        const formattedData = [];
        for (const u of data) {
          const userDto = plainToClass(UserDto, u.friend, {
            excludeExtraneousValues: true,
          });
          formattedData.push({
            ...u.toObject(),
            friend: userDto,
          });
        }
        return formattedData;
      },
    );
  }

  async getFriendRequest(sub: string, options: PaginationOptions) {
    return await paginate(
      this.userRequestFriendModel
        .find({
          receiver: sub,
          deletedAt: null,
        })
        .populate('sender'),
      options,
      async (data) => {
        const formattedData = [];
        for (const friendRequest of data) {
          const userDto = plainToClass(UserDto, friendRequest.sender, {
            excludeExtraneousValues: true,
          });
          formattedData.push({
            ...friendRequest.toObject(),
            sender: userDto,
          });
        }
        return formattedData;
      },
    );
  }

  async isRequestFriend(
    senderId: string | Schema.Types.ObjectId,
    receiverId: string | Schema.Types.ObjectId,
  ) {
    const check = await this.userRequestFriendModel
      .findOne({
        sender: senderId,
        receiver: receiverId,
        deletedAt: null,
      })
      .exec();

    return !!check;
  }

  async sendFriendRequest(dto: FriendRequestDto) {
    const { senderId, receiverId } = dto;
    const sender = await this.userModel.findById(senderId);
    const receiver = await this.userModel.findById(receiverId);

    if (!sender || !receiver) throw new BadRequestException('User not found');

    if (await this.isRequestFriend(senderId, receiverId))
      throw new BadRequestException('You have sent a friend request');

    if (await this.isFriend(dto.receiverId, dto.senderId))
      throw new BadRequestException('You two are already friends');

    const client = await this.redisService.getSocketId(dto.receiverId);
    if (client) {
      const mapped = plainToClass(UserDto, sender, {
        excludeExtraneousValues: true,
      });
      this.socketService.socket
        .to(client)
        .emit(SOCKET_EVENT.USER.SEND_REQUEST_FRIEND, mapped);
    }
    const userRequestFriend = await this.userRequestFriendModel.create({
      sender: sender._id,
      receiver: receiver._id,
    });

    return userRequestFriend;
  }

  async updateInformation(sub: string, userDto: UserUpdateDto) {
    const user = await this.userModel.findOne({ _id: sub });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    user.bio = userDto.bio ?? user.bio;
    user.firstName = userDto.firstName ?? user.firstName;
    user.lastName = userDto.lastName ?? user.lastName;
    user.phone = userDto.phone ?? user.phone;
    user.address = userDto.address ?? user.address;

    user.save();

    return user;
  }

  async changePassword(sub: string, dto: UserChangePasswordDto) {
    const user = await this.userModel.findById(sub);

    const pwMatches = await argon.verify(user.password, dto.oldPassword);

    if (!pwMatches)
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.BAD_REQUEST,
      );

    user.password = await argon.hash(dto.newPassword);
    user.save();

    return user;
  }

  async changeAvatar(sub: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No avatar files provided');
    }
    const user = await this.userModel.findById(sub);
    user.avatar = `${process.env.SERVER_URL}/uploads/user/${file.filename}`;
    user.save();
    return user;
  }

  async getUserById(sub: string, id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User not found');

    return {
      ...plainToClass(UserDto, user, { excludeExtraneousValues: true }),
      ...(await this.getCurrentUser(sub, user._id.toString())),
    };
  }

  async getUserByEmail(sub: string, email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    return {
      ...plainToClass(UserDto, user, { excludeExtraneousValues: true }),
      ...(await this.getCurrentUser(sub, user._id.toString())),
    };
  }
}
