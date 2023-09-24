import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument, PlaylistEnum } from './playlist.model';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.model';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { plainToClass } from 'class-transformer';
import { PlaylistDto } from './dto/playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createPlaylist(sub: string, dto: CreatePlaylistDto) {
    const newPlaylist = this.playlistModel.create({
      name: dto.name,
      songs: [...dto.songs],
      owner: sub,
      accessModifier: dto.accessModifier ?? PlaylistEnum.PUBLIC,
    });
    return plainToClass(PlaylistDto, newPlaylist, {
      excludeExtraneousValues: true,
    });
  }

  async getPlaylistByUser(userId: string) {
    const playlists = await this.playlistModel
      .find({
        owner: userId,
      })
      .populate('owner');
    const formattedData = [];

    for (const item of playlists) {
      const playlist = plainToClass(PlaylistDto, item, {
        excludeExtraneousValues: true,
      });
      formattedData.push(playlist);
    }

    return formattedData;
  }

  async getPlaylistById(id: string) {
    const playlist = await this.playlistModel.findById(id).populate('owner');

    return plainToClass(PlaylistDto, playlist, {
      excludeExtraneousValues: true,
    });
  }

  async deleteSongOnPlaylist(playlistId: string, songId: string) {
    const playlist = await this.playlistModel.findById(playlistId);
    const songIndex = playlist.songs.findIndex((song) => song.id === songId);
    if (songIndex !== -1) {
      playlist.songs.splice(songIndex, 1);
      await playlist.save();
      return true;
    }

    return false;
  }

  async deletePlaylist(id: string) {
    const playlist = await this.playlistModel.findByIdAndDelete(id);
    return playlist;
  }
}
