import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { IslandConfig } from '../types';
import { VIDEO_MODAL_PROMPT_CONFIG } from '../constants';

interface VideoModalProps {
  videoUrl: string;
  onComplete: () => void;
  islandNumber: number;
  island: IslandConfig;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onComplete, island }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  
  const [modalState, setModalState] = useState<'prompt' | 'video' | 'card'>('prompt');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const handleStartVideo = () => {
    setModalState('video');
  };

  const handleVideoEnd = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setModalState('card');
  }, []);
  
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(err => console.error("Video play failed:", err));
      } else {
        video.pause();
      }
    }
  }, []);
  
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const newTime = (Number(e.target.value) / 100) * video.duration;
      video.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  const hideControls = useCallback(() => {
    if (isPlaying) {
      setShowControls(false);
    }
  }, [isPlaying]);
  
  const resetControlsTimeout = useCallback(() => {
    if(controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(hideControls, 3000);
  }, [hideControls]);

  useEffect(() => {
    if (modalState !== 'video') return;
    
    const videoElement = videoRef.current;
    
    const handlePlay = () => {
      setIsPlaying(true);
      resetControlsTimeout();
    };
    const handlePause = () => {
      setIsPlaying(false);
      if(controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
    };
    const handleTimeUpdate = () => {
      if (videoElement) {
        setCurrentTime(videoElement.currentTime);
        setProgress((videoElement.currentTime / videoElement.duration) * 100);
      }
    };
    const handleLoadedMetadata = () => {
      if (videoElement) {
        setDuration(videoElement.duration);
      }
    };

    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
      if(controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [modalState, handleVideoEnd, resetControlsTimeout]);
  
  const handleMouseMove = () => {
    setShowControls(true);
    resetControlsTimeout();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center z-50 animate-fadeIn p-4 md:p-8">
      {/* Prompt View Wrapper */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500 ease-in ${modalState === 'prompt' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={modalState !== 'prompt'}
      >
        <div className="text-center animate-slideUp">
          <h2 className="text-4xl md:text-6xl font-bold font-orbitron text-white text-shadow-glow mb-10 max-w-4xl">
            {island.promptQuestion || VIDEO_MODAL_PROMPT_CONFIG.title}
          </h2>
        </div>
        <div className="mt-8 animate-slideUp" style={{ animationDelay: '200ms' }}>
          <button
            onClick={handleStartVideo}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            {VIDEO_MODAL_PROMPT_CONFIG.buttonText}
          </button>
        </div>
      </div>

      {/* Video View Wrapper */}
      <div
        className={`w-full max-w-6xl transition-all duration-500 ease-out ${modalState === 'video' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        aria-hidden={modalState !== 'video'}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <div className="relative aspect-video w-full bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-cyan-500/30 group">
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
            aria-label={`Demonstration video for ${island.name}`}
            onClick={togglePlayPause}
          />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <button
                onClick={togglePlayPause}
                className="pointer-events-auto w-20 h-20 md:w-24 md:h-24 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 border-2 border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 transform hover:scale-110"
                aria-label="Play video"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </button>
            </div>
          )}

          <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            <header className="p-4 md:p-6 bg-gradient-to-b from-black/70 to-transparent">
              <h2 className="text-xl md:text-2xl font-bold font-orbitron text-cyan-300 text-shadow">
                Strategy Briefing: {island.name}
              </h2>
            </header>
            
            <div className="p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-auto">
                <div className="w-full flex items-center gap-4 text-white">
                    <button
                        onClick={togglePlayPause}
                        aria-label={isPlaying ? "Pause" : "Play"}
                        className="p-2"
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>
                    <span className="text-sm font-mono w-14 text-center">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleScrubberChange}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        aria-label="Video progress scrubber"
                    />
                    <span className="text-sm font-mono w-14 text-center">{formatTime(duration)}</span>
                    <button
                        onClick={handleVideoEnd}
                        className="px-4 py-1.5 bg-black/50 backdrop-blur-sm text-white/80 rounded-lg border border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 text-xs"
                        aria-label="Skip strategy briefing"
                    >
                        <span className="flex items-center gap-1 font-semibold">
                            SKIP
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Unlocked Card View Wrapper */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500 ease-in ${modalState === 'card' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transitionDelay: modalState === 'card' ? '300ms' : '0ms' }}
        aria-hidden={modalState !== 'card'}
      >
        <div className="text-center animate-slideUp" style={{ animationDelay: '100ms' }}>
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white text-shadow-glow mb-8">
            The strategy is unlocked
            </h2>
        </div>

        <div
            className="relative w-[40vh] max-w-[90vw] aspect-[7/12] group rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/20 animate-slideUp"
            style={{ 
                animationDelay: '300ms',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4)) drop-shadow(0 0 25px rgba(0, 255, 255, 0.4))' 
            }}
        >
          <img
            src={island.cardImg}
            alt={`Strategy card for ${island.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none animate-shimmer" />
        </div>

        <div className="mt-8 animate-slideUp" style={{ animationDelay: '500ms' }}>
          <button
            onClick={onComplete}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            Next
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.6s 0.2s ease-out forwards; opacity: 0; }

        .text-shadow { text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8); }
        .text-shadow-glow { text-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3); }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0;
          }
          40% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0.1;
          }
          60% {
            transform: translateX(100%) skewX(-15deg);
            opacity: 0.4;
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
            opacity: 0;
          }
        }
        .animate-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 4s infinite linear;
          animation-delay: 1s;
        }

        /* Scrubber custom styles */
        input[type=range].accent-cyan-400::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: #22d3ee;
            border-radius: 50%;
            cursor: pointer;
            transition: background .2s;
        }

        input[type=range].accent-cyan-400::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #22d3ee;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            transition: background .2s;
        }
      `}</style>
    </div>
  );
};

export default VideoModal;