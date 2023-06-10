import { Expose, Transform } from 'class-transformer';

export class BaseMapEntity {
  @Expose()
  @Transform(({ obj }) => obj._id || null)
  _id: string;

  @Expose()
  @Transform(({ value }) => value || null)
  updatedAt: Date;
  @Expose()
  @Transform(({ value }) => value || null)
  createdAt: Date;
}
