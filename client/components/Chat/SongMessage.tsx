import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useTranslate from '@/hooks/useTranslate';
import { useGetSong } from '@/service/MusicService';
import toast from 'react-hot-toast';
import { FiPauseCircle } from 'react-icons/fi';
import { BsFillPlayFill } from 'react-icons/bs';
import { convertSecondToMinute } from '@/utils/TimerUtils';
import Slider from '@/components/MP3/Slider';
import ButtonHeart from '@/components/MP3/ButtonHeart';

interface IProps {
  song: SongInfoType;
}

const SongMessage: React.FC<IProps> = ({ song }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const t = useTranslate();
  const [currentTime, setCurrentTime] = useState(0);
  useGetSong(song.encodeId, {
    onSuccess: ({ data }: { data: SongType }) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (!data['128']) {
        toast.error('Not enough permission to listen to this song!');
        return;
      }

      audio.src = data['128'];
      audio.setAttribute('crossorigin', 'anonymous');
    },
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleChangeTime = useCallback((timer: number) => {
    setCurrentTime(timer);
  }, []);

  return (
    <div className={'p-2.5 rounded gap-2.5 flex flex-col'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center gap-2.5'}>
          <picture className={'cursor-pointer relative'}>
            <img
              className={'w-[52px] h-[52px] rounded'}
              src={song.thumbnailM}
              alt=""
            />
            <button
              onClick={() => setIsPlaying((e) => !e)}
              className={
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer'
              }>
              {isPlaying ? (
                <FiPauseCircle color={'white'} size={'30px'} />
              ) : (
                <BsFillPlayFill color={'white'} size={'30px'} />
              )}
            </button>
          </picture>
          <div>
            <p className={'font-semibold cursor-pointer text-white'}>
              {song.title}
            </p>
            <p className={'text-[13px] text-[#988fa5]'}>{song.artistsNames}</p>
          </div>
        </div>
        <ButtonHeart song={song} />
      </div>
      <div className={'flex items-center gap-2.5'}>
        <p className={'text-[14px] min-w-[40px] font-semibold text-white'}>
          {convertSecondToMinute(Number(currentTime.toFixed(0)))}
        </p>
        <Slider
          values={[currentTime]}
          max={Number(song.duration) + 1 || 1}
          setValues={(n: number[]) => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.currentTime = n[0];
            setCurrentTime(n[0]);
          }}
        />
        <p className={'text-[14px] min-w-[40px] font-semibold text-white'}>
          {song?.duration ? convertSecondToMinute(song?.duration) : `00:00`}
        </p>
      </div>
      <audio
        onTimeUpdate={(e) => {
          handleChangeTime(e.currentTarget.currentTime);
        }}
        onPause={() => setIsPlaying(false)}
        onPlaying={() => setIsPlaying(true)}
        ref={audioRef}
        className="opacity-0 invisible"
      />
    </div>
  );
};

export default SongMessage;
