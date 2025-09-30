
import React, { useEffect, useRef } from 'react';
import { INTRO_VIDEO_URL, INTRO_VIDEO_MUTED } from '../constants';

interface IntroVideoProps {
  show: boolean;
  onComplete: () => void;
  videoUrl?: string;
  muted?: boolean;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ 
  show, 
  onComplete, 
  videoUrl = INTRO_VIDEO_URL,
  muted = INTRO_VIDEO_MUTED 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (show && videoElement) {
      // Programmatically play the video. This is allowed because it's triggered
      // by a user interaction (the "Explore" button click).
      videoElement.play().catch(error => {
        // Autoplay was prevented for some reason.
        console.warn("Intro video playback failed. Skipping video.", error);
        // Proceed to the app directly to not block the user.
        onComplete();
      });
    }
  }, [show, onComplete]);
  
  const handleSkip = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    onComplete();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black flex items-center justify-center animate-fadeIn">
      <video
        ref={videoRef}
        src={videoUrl}
        onEnded={onComplete}
        muted={muted}
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        aria-label="Introduction video"
      />
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
      
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-10 px-5 py-2 bg-black/50 backdrop-blur-sm text-white/80 rounded-lg border border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 animate-fadeInDelayed text-sm"
        aria-label="Skip introduction video"
      >
        <span className="flex items-center gap-2 font-semibold">
          SKIP
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </span>
      </button>

       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

        @keyframes fadeInDelayed {
          0% { opacity: 0; transform: translateY(10px); }
          66% { opacity: 0; transform: translateY(10px); } /* Wait for 2s */
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDelayed {
          animation: fadeInDelayed 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default IntroVideo;
