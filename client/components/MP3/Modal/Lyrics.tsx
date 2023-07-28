import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import SongItem from './SongItem';
import { Lrc, LrcLine } from 'react-lrc';
import { twMerge } from 'tailwind-merge';
import { useAppSelector } from '@/redux/hooks';
import { useGetLyrics } from '@/service/MusicService';
import axios from 'axios';
import eventBus from '@/config/EventBus';
import { CHANGE_CURRENT_TIME } from '@/constants/Music';
import {removeMetadata} from "@/utils/StringUtils";

interface IProps {}

const Lyrics: React.FC<IProps> = () => {
  const [lyrics, setLyrics] = useState<string>('');
  const lineRefs = useRef<HTMLParagraphElement[]>([]);
  const songCurrent = useAppSelector((state) => state.music.songCurrent);
  const currentTime = useAppSelector((state) => state.music.currentTime);
  useGetLyrics(songCurrent?.encodeId, {
    enabled: songCurrent?.hasLyric && !!songCurrent?.encodeId,
    onSuccess: async ({ data }: any) => {
      if (!data.file) {
        setLyrics('');
        return;
      }
      const response = await axios.get(`${data.file}`, {});
      setLyrics(removeMetadata(response.data));
    },
  });



  const lineRenderer = useCallback(
    ({
      active,
      line,
      index,
    }: {
      active: boolean;
      line: LrcLine;
      index: number;
    }) => {
      return (
        <p
          ref={(c) => {
            if (c) {
              lineRefs.current[index] = c;
            }
          }}
          onClick={() => {
            eventBus.emit(CHANGE_CURRENT_TIME, line.startMillisecond / 1000);
          }}
          className={twMerge(
            'lyric-item cursor-pointer',
            active && 'is-active'
          )}>
          {line.content}
        </p>
      );
    },
    []
  );

  useEffect(() => {
    if (lineRefs.current.length > 0) {
      const currentLineIndex = lineRefs.current.findIndex((ref) => {
        if (!ref.classList.contains('is-active')) return false;
        return ref;
      });
      if (currentLineIndex !== -1) {
        lineRefs.current[currentLineIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentTime]);

  return (
    <div className={'grid grid-cols-12 h-full items-center px-5 gap-5'}>
      <div className={'col-span-5 hidden lg:block'}>
        {songCurrent && <SongItem song={songCurrent} />}
      </div>
      <div className={'scroll-lyric flex-grow col-span-12 lg:col-span-7'}>
        {!!lyrics ? (
          <Lrc
            verticalSpace={true}
            lrc={lyrics}
            lineRenderer={lineRenderer}
            currentMillisecond={currentTime * 1000}
            recoverAutoScrollInterval={5000}
          />
        ) : (
          <p className={'lyric-item'}>Bài này chưa có lyric</p>
        )}
      </div>
    </div>
  );
};

export default Lyrics;
