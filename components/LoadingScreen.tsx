import React from 'react';
import { LOADING_GIF_CONFIG } from '../constants';

interface LoadingScreenProps {
  isLoading: boolean;
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, progress }) => {
  const { url, size, x, y } = LOADING_GIF_CONFIG;

  return (
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!isLoading}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6 text-white">
        <div style={{ transform: `translate(${x}%, ${y}%)` }}>
          <img
            src={url}
            alt="Loading animation"
            className="object-contain"
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          />
        </div>
        <p className="text-2xl font-orbitron tracking-wider text-shadow">
          Loading assets… {progress}%
        </p>
      </div>
      <style>{`
        .text-shadow {
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;