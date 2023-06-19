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
import { google } from 'googleapis';
import { RegisterDto } from './dto/register.dto';

const googleClient = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async googleLogin(tokens) {
    googleClient.setCredentials(tokens);

    const { data } = await google
      .people({
        version: 'v1',
        auth: googleClient,
      })
      .people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses,photos',
      });

    const { photos, names, emailAddresses } = data;
    const email = emailAddresses?.[0]?.value;

    const userCheck = await this.userModel.findOne({ email });

    if (userCheck) {
      return this.signToken(userCheck._id.toString(), userCheck.email);
    }

    const user = await this.userModel.create({
      email: emailAddresses?.[0]?.value,
      firstName: names?.[0]?.givenName,
      lastName: names?.[0]?.familyName,
      avatar: photos?.[0]?.url,
      isNoPassword: true
    });
    return this.signToken(user._id.toString(), user.email);
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User not found');
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
    return this.signToken(user._id.toString(), user.email);
  }

  async signToken(userId: string, email: string) {
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

  async signup(dto: RegisterDto) {
    const check = await this.userModel.findOne({
      email: dto.email,
    });

    if (check)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const hash = await argon.hash(dto.password);

    try {
      const user = await this.userModel.create({
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: hash,
      });

      return this.signToken(user._id.toString(), user.email);
    } catch (error) {
      if (error) {
        throw error;
      }
    }
  }
}
