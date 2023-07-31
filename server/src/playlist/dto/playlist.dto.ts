import { Expose, Transform, Type } from "class-transformer";
import { BaseMapEntity } from "src/shared/base/base-map.entity";
import { PlaylistEnum } from "../playlist.model";
import { UserDto } from "src/user/dto/user.dto";
import { User } from "src/user/user.model";

export class PlaylistDto extends BaseMapEntity {
  @Expose()
  @Transform(({ value }) => value || null)
  name: string;
  @Expose()
  @Transform(({ value }) => value || null)
  accessModifier: PlaylistEnum;
  @Expose()
  @Transform(({ value }) => value || null)
  songs: any[];
  @Expose()
  @Transform(({ value }) => value || null)
  @Type(() => UserDto)
  owner: User | string;
}