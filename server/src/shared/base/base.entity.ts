import { Prop } from '@nestjs/mongoose';

export class BaseEntity {
  @Prop({ default: null })
  deletedAt: Date;
}
