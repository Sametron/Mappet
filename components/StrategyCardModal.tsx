import React, { useState, useEffect } from 'react';
import type { IslandConfig } from '../types';

interface StrategyCardModalProps {
  island: IslandConfig;
  onClose: () => void;
  onWatchAgain: () => void;
}

const StrategyCardModal: React.FC<StrategyCardModalProps> = ({ island, onClose, onWatchAgain }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Duration should match animation
  };

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${island.name} Strategy Card`}
    >
      <div
        className={`relative transition-all duration-300 ease-out ${isClosing ? 'scale-95' : 'scale-100'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking the card container itself
      >
        <div 
            className="relative w-[40vh] max-w-[90vw] aspect-[7/12] group rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/20"
        >
          <img
            src={island.cardImg}
            alt={`Strategy card for ${island.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none animate-shimmer" />
        </div>
      </div>
      
      <div className={`mt-6 text-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
          <button
            onClick={onWatchAgain}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
            aria-label={`Re-watch video for ${island.name}`}
          >
            Watch Again
          </button>
      </div>

       <button
          onClick={handleClose}
          className={`absolute top-4 right-4 text-gray-300 bg-gray-900/50 rounded-full p-2 hover:text-white hover:bg-gray-800/80 transition-all duration-300 z-10 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          aria-label="Close strategy card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fadeOut { animation: fadeOut 0.3s ease-in forwards; }

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

export default StrategyCardModal;
