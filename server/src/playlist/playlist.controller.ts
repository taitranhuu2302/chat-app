import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { API } from 'src/shared/constants/api.constant';
import { PlaylistService } from './playlist.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Controller(API.PLAYLIST.INDEX)
@ApiTags('Playlist')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Post(API.PLAYLIST.CREATE)
  async create(@GetUser() { sub }, dto: CreatePlaylistDto) {
    return this.playlistService.createPlaylist(sub, dto);
  }

  @Get(API.PLAYLIST.GET_BY_USER)
  async getPlaylistByUser(@GetUser() { sub }) {
    return this.playlistService.getPlaylistByUser(sub);
  }

  @Get(API.PLAYLIST.GET_BY_ID)
  async getPlaylistById(@Param('id') id: string) {
    return this.playlistService.getPlaylistById(id);
  }

  @Delete(API.PLAYLIST.DELETE_SONG)
  async deleteSongOnPlaylist(@Param('playlistId') playlistId: string, @Param('songId') songId: string) {
    return this.playlistService.deleteSongOnPlaylist(playlistId, songId);
  }

  @Delete(API.PLAYLIST.DELETE)
  async deletePlaylist(@Param('id') id: string) {
    return this.playlistService.deletePlaylist(id);
  }
}
