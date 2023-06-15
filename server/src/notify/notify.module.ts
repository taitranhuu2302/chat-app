import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyController } from './notify.controller';
import { NotifyModel, NotifySchema } from './notify.model';
import { NotifyService } from './notify.service';

@Module({
  providers: [NotifyService],
  imports: [
    MongooseModule.forFeature([
      {
        name: NotifyModel.name,
        schema: NotifySchema,
      },
    ]),
  ],
  controllers: [NotifyController],
  exports: [NotifyService],
})
export class NotifyModule {}
