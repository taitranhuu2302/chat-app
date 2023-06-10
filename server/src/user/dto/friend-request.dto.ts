import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";

export class FriendRequestDto {
    @ApiProperty()
    @Transform(({value}) => value || null)
    senderId: string;
    @ApiProperty()
    @Transform(({value}) => value || null)
    receiverId: string;
}