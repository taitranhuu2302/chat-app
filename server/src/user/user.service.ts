import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
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
import { Model } from 'mongoose';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import * as argon from 'argon2';
import { FriendRequestDto } from './dto/friend-request.dto';
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

  async test() {
    return this.userRequestFriendModel
      .find()
      .populate('sender')
      .populate('receiver');
  }

  async rejectFriendRequest(dto: FriendRequestDto) {}

  async getFriendRequest(sub: string) {
    const friendRequests = await this.userRequestFriendModel
      .find({
        receiver: sub,
        deletedAt: null,
      })
      .populate('sender');

    return friendRequests.map((friendRequest) => {
      const userDto = plainToClass(UserDto, friendRequest.sender, {
        excludeExtraneousValues: true,
      });
      return {
        ...friendRequest.toObject(),
        sender: userDto,
      };
    });
  }

  async sendFriendRequest(dto: FriendRequestDto) {
    const { senderId, receiverId } = dto;
    const sender = await this.userModel.findById(senderId);
    const receiver = await this.userModel.findById(receiverId);

    if (!sender || !receiver) throw new BadRequestException('User not found');

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

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }
}
