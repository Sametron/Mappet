import React, { useRef, useState, useEffect, useCallback } from 'react';

interface ReplayVideoModalProps {
  videoUrl: string;
  onClose: () => void;
  islandName: string;
}

const ReplayVideoModal: React.FC<ReplayVideoModalProps> = ({ videoUrl, onClose, islandName }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.play().catch(e => console.error("Replay video failed to play", e));

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [onClose]);

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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-[60] animate-fadeIn p-4 md:p-8" onClick={onClose}>
        <div 
          className="w-full max-w-6xl transition-all duration-500 ease-out" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-video w-full bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-cyan-500/30">
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              loop
              className="absolute top-0 left-0 w-full h-full object-cover"
              aria-label={`Replay video for ${islandName}`}
            />
             <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
              <h2 className="text-xl md:text-2xl font-bold font-orbitron text-cyan-300 text-shadow">
                Replay: {islandName}
              </h2>
            </header>
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="px-4 py-2 bg-black/50 backdrop-blur-sm text-white/80 rounded-lg border border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 text-sm"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                <span className="flex items-center gap-2 font-semibold">
                  {isPlaying ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      PAUSE
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      PLAY
                    </>
                  )}
                </span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-black/50 backdrop-blur-sm text-white/80 rounded-lg border border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 text-sm"
                aria-label="Close video"
              >
                <span className="flex items-center gap-2 font-semibold">
                  CLOSE
                </span>
              </button>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
          .text-shadow { text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8); }
        `}</style>
    </div>
  );
}

export default ReplayVideoModal;
