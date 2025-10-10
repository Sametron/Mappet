import React, { useState, useEffect } from 'react';
import { ISLAND_CONFIGS } from '../constants';

interface CompletionScreenProps {
  show: boolean;
  onPlayAgain: () => void;
  onClose: () => void;
}

/* --- EASY EDIT AREA --- */
const CARD_FORMATION_CONFIG = {
  size: {
    width: '20vmin',
    maxWidth: '150px',
  },
  positions: [
    // A more compact 2-row formation
    // Top Row (indices 0, 1, 2)
    { x: '-25vmin', y: '-15vh', rotate: '-10deg' },
    { x: '0vmin',   y: '-18vh', rotate: '0deg'  },
    { x: '25vmin',  y: '-15vh', rotate: '10deg'  },
    // Bottom Row (indices 3, 4, 5)
    { x: '-25vmin', y: '15vh', rotate: '10deg' },
    { x: '0vmin',   y: '18vh', rotate: '0deg'   },
    { x: '25vmin',  y: '15vh', rotate: '-10deg'  },
  ],
};
/* --- END EASY EDIT AREA --- */

const CompletionScreen: React.FC<CompletionScreenProps> = ({ show, onPlayAgain, onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (show) {
      const timers: number[] = [];
      // Animation sequence
      timers.push(window.setTimeout(() => setStep(1), 100));   // 1. Show "Congrats!" text
      timers.push(window.setTimeout(() => setStep(2), 600));   // 2. Animate cards into formation
      timers.push(window.setTimeout(() => setStep(3), 2000));  // 3. Show buttons after cards are settled
      
      return () => { 
        timers.forEach(clearTimeout); 
      };
    } else {
      // Reset animation state when hidden
      setStep(0);
    }
  }, [show]);

  if (!show) return null;

  const showCongrats        = step >= 1;
  const cardsInFormation    = step >= 2;
  const showButtons         = step >= 3;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center z-50 animate-fadeIn overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(15, 36, 96, 1) 0%, #0a1941 100%)' }} />
      <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.4) 0%, transparent 60%)' }} />

      <div className="relative text-center z-10 w-full h-full flex flex-col items-center justify-between py-12 md:py-16">
        {/* Congrats Header */}
        <div className={`transition-all duration-700 ease-out ${showCongrats ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}`}>
          <h1 className={`text-6xl md:text-8xl font-black font-orbitron tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-2 text-shadow-glow animate-pulse-gentle`}>
            Congrats!
          </h1>
        </div>

        {/* Cards Container — absolutely positioned in the middle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {ISLAND_CONFIGS.map((island, index) => {
            const getCardClass = () => {
              let classes = 'card-wrapper';
              if (cardsInFormation) classes += ' card-in-formation';
              return classes;
            };

            const pos = CARD_FORMATION_CONFIG.positions[index];
            const style = {
              width: CARD_FORMATION_CONFIG.size.width,
              maxWidth: CARD_FORMATION_CONFIG.size.maxWidth,
              '--formation-x': pos.x,
              '--formation-y': pos.y,
              '--formation-rotate': pos.rotate,
              transitionDelay: `${index * 150}ms`,
              zIndex: 10 + index,
            } as React.CSSProperties;

            return (
              <div key={island.name} className={getCardClass()} style={style}>
                <img
                  src={island.cardImg}
                  alt={island.name}
                  className="w-full h-full object-cover rounded-xl shadow-2xl border-2 border-white/20"
                />
              </div>
            );
          })}
        </div>
        
        {/* Buttons Footer */}
        <div className={`transition-all duration-700 ease-out ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onPlayAgain} className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20">
              Play Again
            </button>
            <button onClick={onClose} className="px-10 py-4 bg-white/10 border border-white/30 text-white font-bold text-xl rounded-lg hover:bg-white/20 transition-colors duration-300">
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1.03); text-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3); }
          50% { transform: scale(1); text-shadow: 0 0 25px rgba(0, 255, 255, 0.7), 0 0 40px rgba(0, 255, 255, 0.5); }
        }
        .animate-pulse-gentle { animation: pulse-gentle 2.5s infinite ease-in-out; }
        .text-shadow-glow { text-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3); }

        /* --- CARD LAYOUT (centred from its own middle) --- */
        .card-wrapper{
          position:absolute;
          left:0;
          top:0;
          transform-origin:center center;
          aspect-ratio:7/12;

          /* initial state: start from centre of container */
          opacity:0;
          transform: translate(-50%, -50%) translateY(50vh) scale(0.5);
          transition: transform 1.2s cubic-bezier(0.34,1.56,0.64,1), opacity .8s ease;
        }

        .card-in-formation{
          opacity:1;
          /* keep centred, then add formation offsets */
          transform: translate(calc(-50% + var(--formation-x)),
                               calc(-50% + var(--formation-y)))
                     rotate(var(--formation-rotate));
        }
      `}</style>
    </div>
  );
};

export default CompletionScreen;
