import { IsNotEmpty } from 'class-validator';

export class MessageCreateDto {
  text?: string;
  songs?: any[];
  reply?: string;
  @IsNotEmpty()
  conversation: string;
  gifs?: string[];
}