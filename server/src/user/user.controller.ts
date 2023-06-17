import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { API } from '../shared/constants/api.constant';
import { PaginateQuery } from '../shared/decorator/pagination-query.decorator';
import { localOptionsUserAvatar } from '../shared/helper/file.helper';
import { PaginationOptions } from '../shared/helper/pagination.helper';
import { FriendRequestDto } from './dto/friend-request.dto';
import { UnFriendDto } from './dto/un-friend.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller(API.USER.INDEX)
@ApiTags('User')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async index(
    @GetUser() { sub },
    @PaginateQuery() paginate: PaginationOptions,
  ) {
    return this.userService.index(sub, paginate);
  }

  @Get(API.USER.SEARCH)
  @ApiQuery({ name: 'keywords', type: String })
  async search(
    @GetUser() { sub },
    @PaginateQuery() paginate: PaginationOptions,
    @Query('keywords') keywords,
  ) {
    return this.userService.searchUser(sub, paginate, keywords);
  }

  @Get(API.USER.GET_REQUEST_FRIEND)
  @HttpCode(HttpStatus.OK)
  async getFriendRequest(
    @Param() params,
    @PaginateQuery() paginate: PaginationOptions,
  ) {
    return this.userService.getFriendRequest(params.id, paginate);
  }

  @Post(API.USER.UN_FRIEND)
  @HttpCode(HttpStatus.OK)
  async unFriend(@GetUser() { sub }, @Body() dto: UnFriendDto) {
    return this.userService.unFriend(sub, dto.friendId);
  }

  @Get(API.USER.GET_FRIEND)
  async getFriends(
    @Param() params,
    @PaginateQuery() paginate: PaginationOptions,
  ) {
    return this.userService.getFriends(params.id, paginate);
  }

  @Post(API.USER.ACCEPT_REQUEST_FRIEND)
  @ApiBody({ type: FriendRequestDto })
  @HttpCode(HttpStatus.OK)
  async acceptFriendRequest(@GetUser() { sub }, @Body() dto: FriendRequestDto) {
    return this.userService.acceptFriendRequest(sub, dto);
  }

  @Post(API.USER.REJECT_REQUEST_FRIEND)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: FriendRequestDto })
  async rejectFriendRequest(@GetUser() { sub }, @Body() dto: FriendRequestDto) {
    return this.userService.rejectFriendRequest(sub, dto);
  }

  @Post(API.USER.SEND_REQUEST_FRIEND)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: FriendRequestDto })
  async sendFriendRequest(@Body() dto: FriendRequestDto) {
    return await this.userService.sendFriendRequest(dto);
  }

  @Post(API.USER.CANCEL_REQUEST_FRIEND)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: FriendRequestDto })
  async cancelFriendRequest(@Body() dto: FriendRequestDto) {
    return await this.userService.cancelFriendRequest(dto);
  }

  @Get(API.USER.GET_BY_EMAIL)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'email' })
  async getByEmail(@GetUser() { sub }, @Param() params: any) {
    const { email } = params;
    return await this.userService.getUserByEmail(sub, email);
  }

  @Get(API.USER.GET_BY_ID)
  @ApiParam({ name: 'id' })
  async getById(@GetUser() { sub }, @Param() params: any) {
    const { id } = params;
    return await this.userService.getUserById(sub, id);
  }

  @Put(API.USER.UPDATE)
  @ApiBody({ type: UserUpdateDto })
  async update(@GetUser() { sub }, @Body() userDto: UserUpdateDto) {
    return await this.userService.updateInformation(sub, userDto);
  }

  @Put(API.USER.CHANGE_PASSWORD)
  @ApiBody({ type: UserChangePasswordDto })
  async changePassword(@GetUser() { sub }, @Body() dto: UserChangePasswordDto) {
    const user = await this.userService.changePassword(sub, dto);
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Get(API.USER.COUNT_REQUEST_FRIEND)
  async countRequestFriend(@GetUser() { sub }) {
    return this.userService.countRequestFriend(sub);
  }

  @Post(API.USER.CHANGE_AVATAR)
  @HttpCode(HttpStatus.OK)
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
