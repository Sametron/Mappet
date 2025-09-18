
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-gray-900/50 border border-cyan-500/50 rounded-lg shadow-2xl p-4 md:p-6 w-full max-w-6xl animate-slideUp">
        <h2 className="text-2xl font-bold mb-4 font-orbitron text-cyan-300 text-center lg:text-left">Strategy Briefing: {island.name}</h2>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Video Player */}
          <div className="w-full lg:w-2/3">
            <div className="aspect-video bg-black rounded-md overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                playsInline
                controls
                className="w-full h-full"
                aria-label={`Demonstration video for ${island.name}`}
              />
            </div>
          </div>
          {/* Strategy Card */}
          <div className="w-full lg:w-1/3 flex justify-center">
             <div className="relative group rounded-[26px] overflow-hidden border-2 border-white/10 shadow-lg">
                <img
                    src={island.cardImg}
                    alt={`Strategy card for ${island.name}`}
                    className="block max-h-[40vh] lg:max-h-[60vh] w-auto"
                />
                <div className="absolute inset-0 pointer-events-none animate-shimmer" />
             </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
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
