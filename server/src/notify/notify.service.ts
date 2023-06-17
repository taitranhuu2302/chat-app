import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaginationOptions,
  paginate,
} from 'src/shared/helper/pagination.helper';
import { NotifyCreateDto } from './dto/notify-create.dto';
import { NotifyDocument, NotifyModel } from './notify.model';

@Injectable()
export class NotifyService {
  constructor(
    @InjectModel(NotifyModel.name) private notifyModel: Model<NotifyDocument>,
  ) {}

  async getAllNotifyByUser(sub: string, options: PaginationOptions) {
    return paginate(
      this.notifyModel.find({ owner: sub }).populate({
        path: 'userRequestFriend',
        populate: {
          path: 'sender',
        },
      }),
      options,
    );
  }

  async createNotify(dto: NotifyCreateDto) {
    return this.notifyModel.create({
      title: dto.title,
      description: dto.description,
      owner: dto.owner,
      userFriend: dto.userFriend,
      type: dto.type,
      userRequestFriend: dto.userRequestFriend,
    });
  }
}
