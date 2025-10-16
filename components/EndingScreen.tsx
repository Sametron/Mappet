import React from 'react';
import { ENDING_BACKGROUND_URL, END_RESULT_IMAGE_URL } from '../constants';

interface EndingScreenProps {
  show: boolean;
  onPlayAgain: () => void;
  onClose: () => void;
}

const EndingScreen: React.FC<EndingScreenProps> = ({ show, onPlayAgain, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[55] flex flex-col items-center justify-between p-8 md:py-16 bg-cover bg-center animate-fadeIn"
      style={{ backgroundImage: `url(${ENDING_BACKGROUND_URL})` }}
    >
      {/* Vignette Overlay */}
      <div 
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(15, 36, 96, 0.7) 85%)' }}
      ></div>

      <div className="flex flex-col items-center text-center">
        <header className="relative animate-slideDown">
          <h1 className="text-5xl md:text-7xl font-black font-orbitron text-white text-shadow-glow">
            APAC’s 2028 Ambition
          </h1>
        </header>

        <div className="relative mt-8 md:mt-12 animate-fadeIn" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
          <img
            src={END_RESULT_IMAGE_URL}
            alt="APAC's 2028 Ambition Result"
            className="max-w-[70vw] max-h-[45vh] object-contain"
          />
        </div>
      </div>

      <footer className="relative animate-slideUp">
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onPlayAgain} className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20">
            Play Again
          </button>
          <button onClick={onClose} className="px-10 py-4 bg-white/10 border border-white/30 text-white font-bold text-xl rounded-lg hover:bg-white/20 transition-colors duration-300">
            Close
          </button>
        </div>
      </footer>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }

        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.8s 0.3s ease-out forwards; opacity: 0; }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.8s 0.3s ease-out forwards; opacity: 0; }
        
        .text-shadow-glow { text-shadow: 0 0 15px rgba(255, 255, 255, 0.7), 0 0 30px rgba(255, 255, 255, 0.4); }
      `}</style>
    </div>
  );
};

export default EndingScreen;