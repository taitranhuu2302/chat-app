import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ConversationAddMemberDto {
  @IsArray()
  members: string[];
  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
