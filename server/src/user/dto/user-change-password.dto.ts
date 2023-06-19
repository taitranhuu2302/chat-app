import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from '../../shared/decorator/matches.decorator';

export class UserChangePasswordDto {
  @ApiProperty({ default: 'Password@123' })
  oldPassword: string;
  @ApiProperty({ default: 'Password@123' })
  @IsNotEmpty({ message: 'New password is not empty' })
  @IsString()
  newPassword: string;
  @IsNotEmpty({ message: 'New password is not empty' })
  @IsString()
  @ApiProperty({ default: 'Password@123' })
  @Match('newPassword')
  confirmNewPassword: string;
}
