
import React, { useEffect, useRef } from 'react';
import type { IslandConfig } from '../types';

interface VideoModalProps {
  videoUrl: string;
  onComplete: () => void;
  islandNumber: number;
  island: IslandConfig;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onComplete, island }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('ended', onComplete);
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', onComplete);
      }
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center z-50 animate-fadeIn p-4 md:p-8">
      {/* Container for the stage and button */}
      <div className="w-full max-w-6xl animate-slideUp">
        {/* 16:9 Main Stage */}
        <div className="relative aspect-video w-full bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-cyan-500/30">
          
          {/* Cinematic Video Background */}
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            playsInline
            controls
            className="absolute top-0 left-0 w-full h-full object-cover"
            aria-label={`Demonstration video for ${island.name}`}
          />
          
          {/* Header Overlay */}
          <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
            <h2 className="text-xl md:text-2xl font-bold font-orbitron text-cyan-300 text-shadow">
              Strategy Briefing: {island.name}
            </h2>
          </header>

          {/* Floating Strategy Card */}
          <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[25%] z-10">
            <div 
              className="relative group rounded-2xl overflow-hidden" 
              style={{
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4)) drop-shadow(0 0 15px rgba(0, 255, 255, 0.3))'
              }}
            >
              <img
                src={island.cardImg}
                alt={`Strategy card for ${island.name}`}
                className="block w-full h-auto aspect-[7/12] object-cover"
              />
              <div className="absolute inset-0 pointer-events-none animate-shimmer" />
            </div>
          </div>
        </div>
        
        {/* Action Button Below Frame */}
        <div className="mt-6 text-center">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            Mark as Complete
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
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; animation-delay: 0.1s; opacity: 0; }

        .text-shadow { text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8); }

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
