import { BaseEntity } from '../../shared/base/base.entity';
import { Expose, Transform } from 'class-transformer';
import { User } from '../user.model';

export class UserDto extends BaseEntity {
  _id: string;

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

  constructor(user: User) {
    super();
    Object.assign(this, user);
  }
}
