import { BaseMapEntity } from "src/shared/base/base-map.entity";
import { Expose, Transform, Type } from 'class-transformer';
import { UserDto } from "src/user/dto/user.dto";
import { ReactionEnum } from "../reactions.model";

export class ReactionDto extends BaseMapEntity {
  @Expose()
  @Transform(({ value }) => value || null)
  @Type(() => UserDto)
  user: UserDto;
  @Expose()
  @Transform(({ value }) => value || null)
  reactionType: ReactionEnum
}