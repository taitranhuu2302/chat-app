import { IsNotEmpty } from 'class-validator';

export class MessageCreateDto {
  text?: string;
  reply?: string;
  @IsNotEmpty()
  conversation: string;
}
