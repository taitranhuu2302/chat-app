import { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";

interface IProps {
  src: string
  dataFancybox?: string;
}

const VideoPlayer: React.FC<IProps> = ({ src, dataFancybox }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    const videoElement = videoRef.current;

    if (videoElement && !isFullscreen) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }

      setIsPlaying(!isPlaying);
    }
  };

  const enterFullscreen = () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
        // @ts-ignore
      } else if (videoElement.mozRequestFullScreen) {
        // @ts-ignore
        videoElement.mozRequestFullScreen();
        // @ts-ignore
      } else if (videoElement.webkitRequestFullscreen) {
        // @ts-ignore
        videoElement.webkitRequestFullscreen();
        // @ts-ignore
      } else if (videoElement.msRequestFullscreen) {
        // @ts-ignore
        videoElement.msRequestFullscreen();
      }

      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        // @ts-ignore
        document.mozFullScreenElement ||
        // @ts-ignore
        document.webkitFullscreenElement ||
        // @ts-ignore
        document.msFullscreenElement;

      setIsFullscreen(!!fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'msfullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  const handleDoubleClick = () => {
    enterFullscreen();
  };

  return (
    <div className="relative" onDoubleClick={handleDoubleClick}>
      <video
        ref={videoRef}
        src={src}
        data-fancybox={dataFancybox}
        className="rounded-lg h-full cursor-pointer"
        autoPlay={false}
        onClick={togglePlay}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}></video>
      {!isPlaying && (
        <div className="position-center cursor-pointer">
          <FaPlay color="white" size={30} onClick={togglePlay} />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer