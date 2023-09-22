import {IsEnum, IsNotEmpty} from "class-validator";
import {ReactionEnum} from "../reactions.model";
import { ApiProperty } from "@nestjs/swagger";

export class ReactionCreateDto {
	@IsNotEmpty()
  @ApiProperty()
	messageId: string;
	@IsNotEmpty()
  @IsEnum(ReactionEnum, { message: 'Invalid reactionType' }) // Sử dụng IsEnum để kiểm tra giá trị của reactionType
  @ApiProperty({default: ReactionEnum.HEART})
	reactionType: ReactionEnum;
}