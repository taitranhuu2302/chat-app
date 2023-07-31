import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './playlist.model';
import { User, UserSchema } from 'src/user/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Playlist.name, schema: PlaylistSchema},
      {name: User.name, schema: UserSchema}
    ]),
  ],
  providers: [PlaylistService],
  controllers: [PlaylistController]
})
export class PlaylistModule {}
