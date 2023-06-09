import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { API } from '../shared/constants/api.constant';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from './guard/jwt.guard';
import { GetUser } from './decorator/get-user.decorator';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../user/dto/user.dto';

@Controller(API.AUTH.INDEX)
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post(API.AUTH.LOGIN)
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(API.AUTH.REGISTER)
  @ApiBody({ type: RegisterDto })
  signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(JwtGuard)
  @Get(API.AUTH.GET_ME)
  async getMe(@GetUser() { sub }) {
    const user = await this.authService.findUserById(sub);
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
