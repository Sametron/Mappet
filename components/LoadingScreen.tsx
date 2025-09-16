import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

interface LoadingScreenProps {
  isLoading: boolean;
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, progress }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!isLoading}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6 text-white">
        <SpinnerIcon className="w-16 h-16 text-cyan-400 animate-spin" />
        <p className="text-2xl font-orbitron tracking-wider text-shadow">
          Loading assets… {progress}%
        </p>
      </div>
      <style>{`
        .text-shadow {
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }
        /* The animate-spin utility from TailwindCSS should handle this, 
           but adding it here ensures it works if Tailwind JIT misses it. */
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
