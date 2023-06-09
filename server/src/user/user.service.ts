import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.model';
import { Model } from 'mongoose';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
}
