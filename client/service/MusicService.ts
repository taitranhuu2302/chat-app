import { useQuery } from 'react-query';
import axios from 'axios';

export const useGetCharts = (options?: any) => {
  return useQuery(
    ['get-new-release-charts'],
    (): Promise<MusicResponse<ChartsType>> =>
      axios.get('/api/music/charts').then((res) => res.data),
    { ...options }
  );
};

export const useGetSong = (id?: string, options?: any) => {
  return useQuery(['get-song-source', id], (): Promise<MusicResponse<SongType>> => 
  axios.get(`/api/music/song/${id}`).then(res => res.data), {
    enabled: !!id,
    ...options
  })
}