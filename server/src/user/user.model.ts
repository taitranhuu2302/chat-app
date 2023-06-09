import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../shared/base/base.entity';
import { HydratedDocument } from 'mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User extends BaseEntity {
  @Prop({ isRequired: true, unique: true })
  email: string;
  @Prop({ isRequired: true })
  @Exclude()
  password: string;
  @Prop()
  bio: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  phone: string;
  @Prop()
  address: string;
  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
