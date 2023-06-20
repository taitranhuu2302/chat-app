import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { ConversationType } from "../conversation.model";

export class ConversationCreateDto {
    @ApiProperty({ default: 'Conversation Name' })
    @Optional()
    conversationName: string;
    @IsArray()
    @ApiProperty()
    members: string[]
    @ApiProperty()
    conversationType: ConversationType
}