import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';

export class BaseEntity {
  @Expose()
  _id: string;

  @Prop({ default: null })
  @Expose()
  @Transform(({ value }) => value || null)
  deletedAt: Date;
}
