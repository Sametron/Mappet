
import React, { useEffect, useRef } from 'react';

interface VideoModalProps {
  videoUrl: string;
  onComplete: () => void;
  islandNumber: number;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onComplete, islandNumber }) => {
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gray-900/50 border border-cyan-500/50 rounded-lg shadow-2xl p-4 w-full max-w-4xl animate-slideUp">
        <h2 className="text-2xl font-bold mb-4 font-orbitron text-cyan-300">Strategy Briefing: Location {islandNumber}</h2>
        <div className="aspect-video bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            playsInline
            controls
            className="w-full h-full"
          />
        </div>
        <div className="mt-4 text-center">
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
      `}</style>
    </div>
  );
};

export default VideoModal;
