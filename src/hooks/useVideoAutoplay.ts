import { useEffect, useRef, useState, useCallback } from 'react';

interface UseVideoAutoplayOptions {
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  playbackRate?: number;
  intersectionThreshold?: number;
  pauseOnHidden?: boolean;
  lowPowerMode?: boolean;
}

interface UseVideoAutoplayReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  isLoaded: boolean;
  hasError: boolean;
  play: () => Promise<void>;
  pause: () => void;
  setPlaybackRate: (rate: number) => void;
}

export function useVideoAutoplay(options: UseVideoAutoplayOptions = {}): UseVideoAutoplayReturn {
  const {
    muted = true,
    loop = true,
    playsInline = true,
    preload = 'auto',
    playbackRate = 1,
    intersectionThreshold = 0.1,
    pauseOnHidden = true,
    lowPowerMode = false,
  } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video || hasError) return;

    try {
      video.muted = muted;
      video.playsInline = playsInline;
      video.playbackRate = playbackRate;

      if (video.readyState >= 2) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.addEventListener('canplay', async () => {
          try {
            await video.play();
            setIsPlaying(true);
          } catch (err) {
            console.warn('Video autoplay failed:', err);
            setHasError(true);
          }
        }, { once: true });
      }
    } catch (err) {
      console.warn('Video autoplay failed:', err);
      setHasError(true);
    }
  }, [muted, playsInline, playbackRate, hasError]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = preload;
    video.loop = loop;

    const handleLoadedData = () => setIsLoaded(true);
    const handleError = () => setHasError(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    if (lowPowerMode) {
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-video-player-type', 'h5');
      video.setAttribute('x5-video-player-fullscreen', 'false');
    }

    play();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [preload, loop, play, lowPowerMode]);

  useEffect(() => {
    if (!pauseOnHidden || !videoRef.current) return;

    const video = videoRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isPlaying && !hasError) {
              play();
            }
          } else {
            if (isPlaying) {
              pause();
            }
          }
        });
      },
      { threshold: intersectionThreshold }
    );

    observerRef.current.observe(video);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pauseOnHidden, intersectionThreshold, isPlaying, hasError, play, pause]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pause();
      } else if (!document.hidden && !hasError) {
        play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasError, play, pause]);

  return {
    videoRef,
    isPlaying,
    isLoaded,
    hasError,
    play,
    pause,
    setPlaybackRate,
  };
}
