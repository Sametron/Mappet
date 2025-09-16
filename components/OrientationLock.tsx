import React from 'react';
import RotateIcon from './icons/RotateIcon';

const OrientationLock: React.FC = () => {
  return (
    <div 
      id="orientation-lock"
      className="fixed inset-0 bg-gray-900 z-[200] flex-col items-center justify-center text-center p-8 text-white hidden"
    >
      <RotateIcon className="w-24 h-24 text-cyan-300 mb-8 animate-pulse-slow" />
      <h2 className="text-3xl font-bold font-orbitron mb-2">Please Rotate Your Device</h2>
      <p className="text-lg text-cyan-200">This experience is designed for landscape view.</p>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s ease-in-out infinite;
        }

        /* Show the overlay only on screens up to 1024px wide when in portrait orientation */
        @media screen and (max-width: 1024px) and (orientation: portrait) {
          #orientation-lock {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default OrientationLock;
