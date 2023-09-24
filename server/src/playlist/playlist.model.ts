import { Prop, Schema as SchemaDecorator, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { BaseEntity } from 'src/shared/base/base.entity';
import { User } from 'src/user/user.model';

export type PlaylistDocument = HydratedDocument<Playlist>;

export enum PlaylistEnum {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

@SchemaDecorator({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Playlist extends BaseEntity {
  @Prop()
  name: string;
  @Prop({ default: PlaylistEnum.PUBLIC })
  accessModifier: PlaylistEnum;
  @Prop()
  songs: any[];
  @Prop({ type: Schema.Types.ObjectId, ref: User.name })
  owner: User | string;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist)