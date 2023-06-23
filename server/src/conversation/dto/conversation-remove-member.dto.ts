import { IsNotEmpty } from 'class-validator';

export class ConversationRemoveMemberDto {
  @IsNotEmpty()
  conversationId: string;
  userId?: string;
}