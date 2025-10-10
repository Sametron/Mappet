import React, { useRef, useState, useEffect, useCallback } from 'react';

interface ReplayVideoModalProps {
  videoUrl: string;
  onClose: () => void;
  islandName: string;
}

const ReplayVideoModal: React.FC<ReplayVideoModalProps> = ({ videoUrl, onClose, islandName }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);

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
    
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (videoElement) {
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.play().catch(e => console.error("Replay video failed to play", e));
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
      if(controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, resetControlsTimeout]);
  
  const handleMouseMove = () => {
    setShowControls(true);
    resetControlsTimeout();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-[60] animate-fadeIn p-4 md:p-8" onClick={onClose}>
        <div 
          className="w-full max-w-6xl transition-all duration-500 ease-out" 
          onClick={(e) => e.stopPropagation()}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <div className="relative aspect-video w-full bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-cyan-500/30 group">
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              loop
              className="absolute top-0 left-0 w-full h-full object-cover"
              aria-label={`Replay video for ${islandName}`}
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
                  Replay: {islandName}
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
                          onClick={onClose}
                          className="px-4 py-1.5 bg-black/50 backdrop-blur-sm text-white/80 rounded-lg border border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 text-xs"
                          aria-label="Close video"
                      >
                          <span className="flex items-center gap-1 font-semibold">
                              CLOSE
                          </span>
                      </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
          .text-shadow { text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8); }

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
}

export default ReplayVideoModal;