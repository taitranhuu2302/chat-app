import {
	Prop,
	SchemaFactory,
	Schema as SchemaDecorator,
} from '@nestjs/mongoose';
import {HydratedDocument, Schema} from 'mongoose';
import {BaseEntity} from 'src/shared/base/base.entity';
import {User} from "../user/user.model";
import {Message} from "../message/message.model";

export type ReactionDocument = HydratedDocument<Reaction>

export enum ReactionEnum {
	LIKE = "like",
	HEART= "heart",
	HAHA = "haha",
	WOW = "wow",
	SAD = "sad",
	Angry = "angry"
}

@SchemaDecorator({
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
})
export class Reaction extends BaseEntity {
	@Prop({ type: Schema.Types.ObjectId, ref: 'User' })
	user: User | string
	@Prop({ type: Schema.Types.ObjectId, ref: 'Message' })
	message: Message | string
	@Prop()
	reactionType: ReactionEnum
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction)