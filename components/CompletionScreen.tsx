import React from 'react';
import ResetIcon from './icons/ResetIcon';

interface CompletionScreenProps {
  show: boolean;
  onReset: () => void;
}

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute" style={style}></div>
);

const CompletionScreen: React.FC<CompletionScreenProps> = ({ show, onReset }) => {
  if (!show) {
    return null;
  }

  const confettiCount = 150;
  const confettiColors = ['#06b6d4', '#3b82f6', '#ffffff', '#a5f3fc', '#60a5fa'];

  const confetti = Array.from({ length: confettiCount }).map((_, i) => {
    const size = Math.random() * 8 + 4;
    const style: React.CSSProperties & { '--fall-x-end'?: string } = {
      left: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size * (Math.random() > 0.3 ? 1 : 0.4)}px`,
      backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      '--fall-x-end': `${(Math.random() - 0.5) * 40}vw`,
      animation: `fall ${Math.random() * 4 + 3}s linear ${Math.random() * 5}s infinite`,
      opacity: Math.random() * 0.5 + 0.5,
    };
    return <ConfettiPiece key={i} style={style} />;
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center z-50 animate-fadeIn">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti}
      </div>
      <div className="text-center relative animate-slideUp z-10">
        <h1 className="text-8xl font-black font-orbitron tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-2 text-shadow-glow">
          Congrats!
        </h1>
        <h2 className="text-3xl text-cyan-200 mb-12">All strategies unlocked!</h2>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          <ResetIcon className="w-6 h-6" />
          Play Again
        </button>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.6s 0.2s ease-out forwards; opacity: 0; }
        
        .text-shadow-glow {
          text-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3);
        }

        @keyframes fall {
          from {
            transform: translateY(-10vh) translateX(0vw) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(110vh) translateX(var(--fall-x-end)) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CompletionScreen;
