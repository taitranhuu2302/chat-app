import { Expose, Transform, Type } from 'class-transformer';
import { BaseMapEntity } from 'src/shared/base/base-map.entity';
import { UserDto } from 'src/user/dto/user.dto';
import { ConversationType } from '../conversation.model';

export class ConversationDto extends BaseMapEntity {
  @Expose()
  @Transform(({ value }) => value || null)
  @Type(() => UserDto)
  owner: UserDto;
  @Expose()
  @Transform(({ value }) => value || null)
  conversationName: string;
  @Expose()
  @Transform(({ value }) => value || null)
  avatar: string;
  @Expose()
  @Transform(({ value }) => value || null)
  conversationType: ConversationType;
  @Expose()
  @Transform(({ value }) => value || null)
  @Type(() => UserDto)
  members: UserDto[];
}
