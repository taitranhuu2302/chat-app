import { Expose, Transform } from 'class-transformer';
import { BaseMapEntity } from '../../shared/base/base-map.entity';

export class UserDto extends BaseMapEntity {
  @Expose()
  @Transform(({ value }) => value || null)
  email: string;
  @Expose()
  @Transform(({ value }) => value || null)
  bio: string;
  @Expose()
  @Transform(({ value }) => value || null)
  firstName: string;
  @Expose()
  @Transform(({ value }) => value || null)
  lastName: string;
  @Expose()
  @Transform(({ value }) => value || null)
  phone: string;
  @Expose()
  @Transform(({ value }) => value || null)
  address: string;
  @Expose()
  @Transform(({ value }) => value || null)
  avatar: string;
  @Expose()
  @Transform(({ value }) => value)
  isNoPassword: boolean;
  @Expose()
  @Transform(({ value }) => value || null)
  githubLink: string;
  @Expose()
  @Transform(({ value }) => value || null)
  facebookLink: string;
}
