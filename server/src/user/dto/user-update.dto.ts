import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @Expose()
  @Transform(({ value }) => value || null)
  @ApiProperty({default: "Bio"})
  bio: string;
  @Expose()
  @Transform(({ value }) => value || null)
  @ApiProperty({default: "First Name"})
  firstName: string;
  @Expose()
  @Transform(({ value }) => value || null)
  @ApiProperty({default: "Last Name"})
  lastName: string;
  @Expose()
  @Transform(({ value }) => value || null)
  @ApiProperty({default: "0931983495"})
  phone: string;
  @Expose()
  @Transform(({ value }) => value || null)
  @ApiProperty({default: "Viet Nam"})
  address: string;
  @Expose()
  @Transform(({ value }) => value || null)
  @ApiProperty({default: "github.com"})
  githubLink: string;
  @Expose()
  @Transform(({ value }) => value || null)
  @ApiProperty({default: "facebook.com"})
  facebookLink: string;
}
