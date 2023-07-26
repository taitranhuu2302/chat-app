import eventBus from '@/config/EventBus';
import { CHANGE_CURRENT_TIME } from '@/constants/Music';
import { setCurrentTime, setIsPlaying, setSongChange } from '@/redux/features/MusicSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetSong } from '@/service/MusicService';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const AudioMusic = memo(function AudioMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const songCurrent = useAppSelector((state) => state.music.songCurrent);
  const dispatch = useAppDispatch();
  const isPlaying = useAppSelector((state) => state.music.isPlaying);
  const volume = useAppSelector(state => state.music.volume)
  const currentTime = useAppSelector(state => state.music.currentTime)
  const isLoop = useAppSelector(state => state.music.isLoop)

  useGetSong(songCurrent?.encodeId, {
    onSuccess: ({ data }: { data: SongType }) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (!data['128']) {
        toast.error('Not enough permission to listen to this song!');
        return;
      }

      audio.src = data['128'];
      audio.addEventListener('loadedmetadata', () => {
        audio.play().then(() => {
          dispatch(setIsPlaying(true));
        });
      });
      audio.volume = volume
      audio.setAttribute('crossorigin', 'anonymous');
    },
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    eventBus.on(CHANGE_CURRENT_TIME, (n: any) => {
      dispatch(setCurrentTime(n));
      audio.currentTime = n;

      if (audio.paused) {
        audio.play();
      }
    });

    return () => {
      eventBus.off(CHANGE_CURRENT_TIME);
    };
  }, [audioRef.current]);

  useEffect(() => {
    if (Math.ceil(currentTime) >= Number(songCurrent?.duration)) {
      if (isLoop) {
        audioRef.current!.currentTime = 0
        return;
      }
      
      dispatch(setSongChange("Next"))
    }
  }, [currentTime])

  const handleChangeTime = useCallback((timer: number) => {
    dispatch(setCurrentTime(timer));
  }, []);

  return (
    <audio
      onTimeUpdate={(e) => {
        handleChangeTime(e.currentTarget.currentTime);
      }}
      className="opacity-0 invisible"
      ref={audioRef}></audio>
  );
});

export default AudioMusic