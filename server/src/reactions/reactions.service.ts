import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction, ReactionDocument } from './reactions.model';
import { Model } from 'mongoose';
import {Message, MessageDocument} from "../message/message.model";
import {ReactionCreateDto} from "./dto/reaction-create.dto";

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}
  
  
  async createReactWithMessage(sub: string, dto: ReactionCreateDto) {
    const message = await this.messageModel.findById(dto.messageId);
  
    if (!message) {
      throw new BadRequestException("Message not found");
    }
  
    const existingReaction = await this.reactionModel.findOne({
      user: sub,
      message: message._id,
    }).populate('user');
  
    if (existingReaction) {
      existingReaction.reactionType = dto.reactionType;
      await existingReaction.save();
      return existingReaction;
    } else {
      const newReaction = await this.reactionModel.create({
        user: sub, 
        message: message._id, 
        reactionType: dto.reactionType,
      });

      
      message.reactions.push(newReaction); 
      await message.save();

      await newReaction.populate('user')
      
      return newReaction;
    }
  }
  
  async removeReactions(sub: string, messageId: string) {

    const message = await this.messageModel.findById(messageId)

    if (!message) throw new BadRequestException("Message not found")
    
    const reaction = await this.reactionModel.findOneAndRemove({
      user: sub,
      message: messageId
    })

    if (!reaction) throw new BadRequestException("Reaction message not found")

    const updatedReactions = message.reactions.filter((item) => item.toString() !== reaction._id.toString())
    
    message.reactions = updatedReactions;
    await message.save()

    return reaction;
  }
}
