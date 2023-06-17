import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { API } from 'src/shared/constants/api.constant';
import { PaginationOptions } from 'src/shared/helper/pagination.helper';
import { NotifyService } from './notify.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { PaginateQuery } from 'src/shared/decorator/pagination-query.decorator';

@ApiTags("Notification")
@Controller(API.NOTIFY.INDEX)
@UseGuards(JwtGuard)
export class NotifyController {
  constructor(private notifyService: NotifyService) {}

  @Get('')
  async getAll(@GetUser() { sub }, @PaginateQuery() options: PaginationOptions) {
    return this.notifyService.getAllNotifyByUser(sub, options);
  }
}
