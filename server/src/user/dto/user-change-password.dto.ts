import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from '../../shared/decorator/matches.decorator';

export class UserChangePasswordDto {
  @ApiProperty({ default: 'Password@123' })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;
  @ApiProperty({ default: 'Password@123' })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'Password@123' })
  @Match('newPassword')
  confirmNewPassword: string;
}
