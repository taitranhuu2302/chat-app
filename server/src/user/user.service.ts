import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserFriend,
  UserFriendDocument,
  UserRequestFriend,
  UserRequestFriendDocument,
} from './user.model';
import { Model, Promise, Schema } from 'mongoose';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import * as argon from 'argon2';
import { FriendRequestDto } from './dto/friend-request.dto';
import {
  paginate,
  PaginationOptions,
} from '../shared/helper/pagination.helper';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserFriend.name)
    private userFriendModel: Model<UserFriendDocument>,
    @InjectModel(UserRequestFriend.name)
    private userRequestFriendModel: Model<UserRequestFriendDocument>,
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

  async acceptFriendRequest(sub: string, dto: FriendRequestDto) {
    if (sub !== dto.receiverId)
      throw new UnauthorizedException('You are not authorized');

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

    return null;
  }

  async rejectFriendRequest(sub: string, dto: FriendRequestDto) {
    if (sub !== dto.receiverId && sub !== dto.senderId)
      throw new UnauthorizedException('You are not authorized');

    const receiver = await this.userModel.findById(dto.receiverId);
    const sender = await this.userModel.findById(dto.senderId);

    if (!sender || !receiver) throw new BadRequestException('User not found');

    await this.userRequestFriendModel.findOneAndDelete({
      sender: sender._id,
      receiver: receiver._id,
      deletedAt: null,
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

    return await this.userRequestFriendModel.create({
      sender: sender._id,
      receiver: receiver._id,
    });
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
