
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { IslandConfig } from '../types';

interface VideoModalProps {
  videoUrl: string;
  onComplete: () => void;
  islandNumber: number;
  island: IslandConfig;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onComplete, island }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHasEnded, setVideoHasEnded] = useState(false);
  
  const handleVideoEnd = useCallback(() => {
    setVideoHasEnded(true);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [handleVideoEnd]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center z-50 animate-fadeIn p-4 md:p-8">
      {/* Video View Wrapper */}
      <div
        className={`w-full max-w-6xl transition-all duration-500 ease-out ${videoHasEnded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
        aria-hidden={videoHasEnded}
      >
        <div className="relative aspect-video w-full bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-cyan-500/30">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            playsInline
            controls
            className="absolute top-0 left-0 w-full h-full object-cover"
            aria-label={`Demonstration video for ${island.name}`}
          />
          <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
            <h2 className="text-xl md:text-2xl font-bold font-orbitron text-cyan-300 text-shadow">
              Strategy Briefing: {island.name}
            </h2>
          </header>
        </div>
      </div>
      
      {/* Unlocked Card View Wrapper */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500 ease-in ${videoHasEnded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transitionDelay: videoHasEnded ? '300ms' : '0ms' }}
        aria-hidden={!videoHasEnded}
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
      `}</style>
    </div>
  );
};

export default VideoModal;
