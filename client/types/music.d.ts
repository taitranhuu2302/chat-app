type MusicResponse<T> = {
  err: number;
  msg: string;
  data: T;
  url?: string;
  timestamp: number;
};

type ObjectType = "song" | "hub";

type SearchType = {
  top: SearchTopType | {
    encodeId: string
    cover: string
    thumbnail: string
    thumbnailHasText: string
    thumbnailR: string
    title: string
    link: string
    description: string
    thumbnailM: string
    objectType: ObjectType
  };
  artists: ArtistMoreType[];
  songs: SongInfoType[];
  videos: SearchVideoType[];
  playlists: SongInfoType[];
  topSuggest?: SongInfoType[]
  counter: {
    song: number;
    artist: number;
    playlist: number;
    video: number;
  };
  sectionId: string;
};

type SearchVideoType = {
  encodeId: string;
  title: string;
  alias: string;
  isOffical: boolean;
  username: string;
  artistsNames: string;
  artists: ArtistType[];
  isWorldWide: boolean;
  thumbnailM: string;
  link: string;
  thumbnail: string;
  duration: number;
  streamingStatus: number;
  artist: ArtistType;
};

type SearchTopType = {
  encodeId: string;
  title: string;
  alias: string;
  isOffical: boolean;
  username: string;
  artistsNames: string;
  artists: ArtistType[];
  isWorldWide: boolean;
  thumbnailM: string;
  link: string;
  thumbnail: string;
  duration: number;
  zingChoice: boolean;
  isPrivate: boolean;
  preRelease: boolean;
  releaseDate: number;
  genreIds: string[];
  distributor: string;
  indicators: any[];
  radioId: number;
  isIndie: boolean;
  streamingStatus: number;
  allowAudioAds: boolean;
  hasLyric: boolean;
  objectType: ObjectType
};

type SongType = {
  '128': string;
  '320': string;
};

type SongInfoType = {
  encodeId: string;
  title: string;
  alias: string;
  isOffical: boolean;
  username: string;
  artistsNames: string;
  artists: ArtistType[];
  isWorldWide: boolean;
  thumbnailM: string;
  link: string;
  thumbnail: string;
  duration: number;
  zingChoice: boolean;
  isPrivate: boolean;
  preRelease: boolean;
  releaseDate: number;
  genreIds: string[];
  distributor: string;
  indicators: any[];
  isIndie: boolean;
  streamingStatus: number;
  allowAudioAds: boolean;
  hasLyric: boolean;
  userid: number;
  genres: GenreType[];
  composers: ComposerType[];
  album: AlbumType;
  isRBT: boolean;
  like: number;
  listen: number;
  liked: boolean;
  comment: number;
};

type GenreType = {
  id: string;
  name: string;
  title: string;
  alias: string;
  link: string;
};

type ComposerType = {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  cover: string;
  thumbnail: string;
  totalFollow: number;
};

type ChartsType = {
  banner: string;
  type: string;
  link: string;
  title: string;
  sectionType: string;
  sectionId: string;
  viewType: string;
  items: ChartItemType[];
};

type ChartItemType = {
  encodeId: string;
  title: string;
  alias: string;
  isOffical: boolean;
  username: string;
  artistsNames: string;
  artists: ArtistType[];
  isWorldWide: boolean;
  thumbnailM: string;
  link: string;
  thumbnail: string;
  duration: number;
  zingChoice: boolean;
  isPrivate: boolean;
  preRelease: boolean;
  releaseDate: number;
  genreIds: string[];
  album: AlbumType;
  distributor: string;
  indicators: any[];
  isIndie: boolean;
  streamingStatus: number;
  allowAudioAds: boolean;
  hasLyric: boolean;
  rakingStatus: number;
  releasedAt: number;
};

type ArtistType = {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  thumbnail: string;
  thumbnailM: string;
  isOA: boolean;
  isOABrand: boolean;
  playlistId: string;
};

type ArtistMoreType = ArtistType & {
  totalFollow: number;
};

type AlbumType = {
  encodeId: string;
  title: string;
  thumbnail: string;
  isoffical: boolean;
  link: string;
  isIndie: boolean;
  releaseDate: string;
  sortDescription: string;
  releasedAt: number;
  genreIds: string[];
  PR: boolean;
  artists: ArtistMoreType[];
  artistsNames: string;
};
