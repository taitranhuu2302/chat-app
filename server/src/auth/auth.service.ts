import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { User } from '../user/user.model';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User not found');
    console.log(user.requestFriend);
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.password, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    delete user.password;
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string) {
    const data = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(data, {
      expiresIn: process.env.JWT_EXPIRES,
      secret: process.env.JWT_SECRET,
    });
    return {
      accessToken: token,
    };
  }

  async signup(dto: LoginDto) {
    const check = await this.userModel.findOne({
      email: dto.email,
    });

    if (check)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const hash = await argon.hash(dto.password);

    try {
      const user = await this.userModel.create({
        email: dto.email,
        password: hash,
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error) {
        throw error;
      }
    }
  }
}
