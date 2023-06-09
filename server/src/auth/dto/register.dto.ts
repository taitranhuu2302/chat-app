import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../shared/decorator/matches.decorator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    default: 'example@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    default: 'Password@123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Match('password')
  @ApiProperty({
    type: String,
    default: 'Password@123',
  })
  confirmPassword: string;
}
