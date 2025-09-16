import React from 'react';
import type { IslandConfig } from '../types';

interface IslandInfoModalProps {
  island: IslandConfig;
  onClose: () => void;
}

const IslandInfoModal: React.FC<IslandInfoModalProps> = ({ island, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="island-info-title"
    >
      <div 
        className="bg-gray-900/50 border border-cyan-500/50 rounded-lg shadow-2xl p-6 w-full max-w-2xl animate-slideUp relative text-white"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close island details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="island-info-title" className="text-3xl font-bold mb-4 font-orbitron text-cyan-300 text-shadow pr-8">
          {island.name}
        </h2>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2 border-b-2 border-cyan-500/30 pb-1">Description</h3>
            <p className="text-gray-200">{island.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2 border-b-2 border-cyan-500/30 pb-1">Lore</h3>
            <p className="text-gray-300 italic">{island.lore}</p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

        @keyframes slideUp {
          from { transform: translateY(20px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; animation-delay: 0.1s; opacity: 0; }
        .text-shadow { text-shadow: 0 2px 4px rgba(0, 255, 229, 0.5); }
      `}</style>
    </div>
  );
};

export default IslandInfoModal;