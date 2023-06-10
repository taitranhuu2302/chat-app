import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { API } from '../shared/constants/api.constant';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { localOptionsUserAvatar } from '../shared/helper/file.helper';
import { FriendRequestDto } from './dto/friend-request.dto';

@Controller(API.USER.INDEX)
@ApiTags('User')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('test')
  async test() {
    return this.userService.test();
  }

  @Get(API.USER.GET_REQUEST_FRIEND)
  async getFriendRequest(@GetUser() { sub }: any) {
    return this.userService.getFriendRequest(sub);
  }

  @Post(API.USER.SEND_REQUEST_FRIEND)
  @ApiBody({ type: FriendRequestDto })
  async sendFriendRequest(@Body() dto: FriendRequestDto) {
    return this.userService.sendFriendRequest(dto);
  }

  @Get(API.USER.GET_BY_EMAIL)
  @ApiParam({ name: 'email' })
  async getByEmail(@Param() params: any) {
    const { email } = params;
    const user = await this.userService.getUserByEmail(email);
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Get(API.USER.GET_BY_ID)
  @ApiParam({ name: 'id' })
  async getById(@Param() params: any) {
    const { id } = params;
    console.log(id);
    const user = await this.userService.getUserById(id);
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Put(API.USER.UPDATE)
  @ApiBody({ type: UserUpdateDto })
  async update(@GetUser() { sub }, @Body() userDto: UserUpdateDto) {
    const user = await this.userService.updateInformation(sub, userDto);
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Put(API.USER.CHANGE_PASSWORD)
  @ApiBody({ type: UserChangePasswordDto })
  async changePassword(@GetUser() { sub }, @Body() dto: UserChangePasswordDto) {
    const user = await this.userService.changePassword(sub, dto);
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Post(API.USER.CHANGE_AVATAR)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar', localOptionsUserAvatar))
  async changeAvatar(@GetUser() { sub }, @UploadedFile() file) {
    const user = await this.userService.changeAvatar(sub, file);
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }
}
