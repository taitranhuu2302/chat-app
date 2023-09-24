import {Module} from '@nestjs/common';
import {ReactionsController} from './reactions.controller';
import {ReactionsService} from './reactions.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Reaction, ReactionSchema} from "./reactions.model";
import {Message, MessageSchema} from "../message/message.model";

@Module({
	imports: [
		MongooseModule.forFeature([
			{name: Reaction.name, schema: ReactionSchema},
			{name: Message.name, schema: MessageSchema},
		])
	],
	controllers: [ReactionsController],
	providers: [ReactionsService]
})
export class ReactionsModule {
}
