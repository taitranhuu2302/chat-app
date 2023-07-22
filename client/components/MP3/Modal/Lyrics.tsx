import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import SongItem from './SongItem';
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from 'react-lrc';
import { twMerge } from 'tailwind-merge';

interface IProps {}

const Lyrics: React.FC<IProps> = () => {
    const [lyrics, setLyrics] = useState<string>('');
    const lineRefs = useRef<HTMLParagraphElement[]>([]);

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
                  // dispatch(updateCurrentTimeTemp(line.startMillisecond / 1000));
              }}
              className={twMerge(
                'lyric-item cursor-pointer',
                active && 'is-active'
              )}
            >
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
    }, []);

    return (
      <div className={'grid grid-cols-12 h-full items-center px-5 gap-5'}>
          <div className={'col-span-5 hidden lg:block'}>
              <SongItem />
          </div>
          <div className={'scroll-lyric flex-grow col-span-12 lg:col-span-7'}>
              {/*{sourceCurrent?.lyric ? (*/}
              {/*  <Lrc*/}
              {/*    verticalSpace={true}*/}
              {/*    lrc={lyrics}*/}
              {/*    lineRenderer={lineRenderer}*/}
              {/*    currentMillisecond={currentTime * 1000}*/}
              {/*    recoverAutoScrollInterval={5000}*/}
              {/*  />*/}
              {/*) : (*/}
              {/*  <p className={'lyric-item'}>Bài này chưa có lyric</p>*/}
              {/*)}*/}
          </div>
      </div>
    );
};

export default Lyrics;
