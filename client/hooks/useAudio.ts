import { useEffect, useState } from 'react';

export const useAudio = (audioSrc: string) => {
  const [audio] = useState(new Audio(audioSrc));

  const setVolume = (volume: number) => {
    audio.volume = volume;
  };

  useEffect(() => {
    audio.volume = 0.5;
    return () => {
      audio.pause();
    };
  }, [audio]);

  const handlePlayAudio = () => {
    audio.currentTime = 0;
    audio.play();
  };

  return {
    audio,
    setVolume,
    handlePlayAudio,
  };
};