
import React, { useState } from 'react';
import type { IslandConfig, IslandStatus } from '../types';
import { VIRTUAL_CANVAS_WIDTH, VIRTUAL_CANVAS_HEIGHT } from '../constants';

interface IslandHotspotProps {
  index: number;
  config: IslandConfig;
  status: IslandStatus;
  onClick: () => void;
  isRecentlyUnlocked: boolean;
}

const IslandHotspot: React.FC<IslandHotspotProps> = ({ index, config, status, onClick, isRecentlyUnlocked }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const xPosPercent = (config.x / VIRTUAL_CANVAS_WIDTH) * 100;
  const yPosPercent = (config.y / VIRTUAL_CANVAS_HEIGHT) * 100;
  const sizePercent = (config.size / VIRTUAL_CANVAS_WIDTH) * 100;
  
  const baseClasses = "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out";
  const imageClasses = "w-full h-full object-contain transition-all duration-300";
  
  let buttonStatusClass = '';
  let imageStatusClass = '';
  const isUnlocked = status === 'unlocked';
  const isActive = status === 'active';

  let imageSrc: string;
  switch (status) {
    case 'unlocked':
      imageSrc = config.developedImg;
      break;
    case 'active':
      imageSrc = config.activeImg || config.undevelopedImg;
      break;
    case 'locked':
    default:
      imageSrc = config.undevelopedImg;
      break;
  }
  const altText = `Strategy Island ${config.name} (${status})`;

  if (isUnlocked) {
    buttonStatusClass = 'cursor-pointer';
    imageStatusClass = 'filter drop-shadow(0 0 4px rgba(0, 255, 255, 0.5))'; 
  } else if (isActive) {
    buttonStatusClass = 'cursor-pointer';
    imageStatusClass = 'animate-pulse-glow';
  } else { // Locked
    buttonStatusClass = 'cursor-not-allowed';
    imageStatusClass = 'filter grayscale opacity-60';
  }

  const unlockEffectClass = isRecentlyUnlocked ? 'animate-unlock-effect' : '';
  const briefLore = `"${config.lore.substring(0, 120)}${config.lore.length > 120 ? '…' : ''}"`;

  return (
    <>
      <button
        aria-label={`Open Strategy ${config.name}`}
        className={`${baseClasses} ${buttonStatusClass}`}
        style={{ 
          left: `${xPosPercent}%`, 
          top: `${yPosPercent}%`,
          width: `${sizePercent}%`,
          aspectRatio: '1 / 1',
          zIndex: isHovered ? 40 : 'auto'
        }}
        onClick={onClick}
        disabled={status === 'locked'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={imageSrc}
          alt={altText}
          className={`${imageClasses} ${imageStatusClass} ${unlockEffectClass}`}
        />
        <div
          role="tooltip"
          className={`absolute top-1/2 left-full -translate-y-1/2 ml-4 w-64 p-3 bg-gray-900/80 backdrop-blur-sm rounded-lg text-left shadow-lg pointer-events-none transition-all duration-200 ease-in-out origin-left ${
            isHovered ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-2 scale-95'
          }`}
        >
          <h3 className="font-orbitron font-bold text-cyan-300 text-base">{config.name}</h3>
          <p className="font-sans text-xs text-cyan-100/80 italic mt-1 normal-case tracking-normal">
            {briefLore}
          </p>
        </div>
      </button>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            /* Return to a normal brightness, with a subtle glow */
            filter: brightness(1) drop-shadow(0 0 8px rgba(0, 255, 255, 0.7));
          }
          50% {
            /* Darken the island significantly, while intensifying the glow to maintain visibility */
            filter: brightness(0.4) drop-shadow(0 0 16px rgba(0, 255, 255, 1));
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2.5s infinite ease-in-out;
        }
        
        @keyframes unlock-effect {
          0% {
            filter: brightness(1) drop-shadow(0 0 0px rgba(0, 255, 255, 0));
          }
          40% {
            filter: brightness(1.7) drop-shadow(0 0 35px rgba(0, 255, 255, 1)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
          }
          100% {
            /* End on the final unlocked state's glow for a seamless transition */
            filter: brightness(1) drop-shadow(0 0 4px rgba(0, 255, 255, 0.5));
          }
        }
        .animate-unlock-effect {
          /* Added 'forwards' to hold the final animation state */
          animation: unlock-effect 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </>
  );
};

export default IslandHotspot;
