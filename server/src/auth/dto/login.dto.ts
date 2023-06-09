import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    default: 'example@gmail.com'
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'Password@123'
  })
  password: string;
}
