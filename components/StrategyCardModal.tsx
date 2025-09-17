import React, { useState, useEffect } from 'react';
import type { IslandConfig } from '../types';

interface StrategyCardModalProps {
  island: IslandConfig;
  onClose: () => void;
}

const StrategyCardModal: React.FC<StrategyCardModalProps> = ({ island, onClose }) => {
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
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Duration should match animation
  };

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${island.name} Strategy Card`}
    >
      <div
        className={`relative transition-all duration-300 ease-out cursor-pointer ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking the card container itself
        style={{ animationDelay: '50ms' }}
      >
        <div 
            className="relative w-[40vh] max-w-[90vw] aspect-[7/12] group rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/20 cursor-pointer"
            onClick={handleClose}
        >
          <img
            src={island.cardImg}
            alt={`Strategy card for ${island.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none animate-shimmer" />
        </div>
      </div>
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
