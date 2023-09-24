import { PlaylistEnum } from "../playlist.model";

export class CreatePlaylistDto {
  name: string;
  songs: any[];
  accessModifier: PlaylistEnum
}