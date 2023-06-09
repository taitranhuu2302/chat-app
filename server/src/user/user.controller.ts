import {
  Body,
  Controller,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { API } from '../shared/constants/api.constant';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(API.USER.INDEX)
@ApiTags('User')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
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
  async changeAvatar(
    @GetUser() { sub },
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
  }
}
