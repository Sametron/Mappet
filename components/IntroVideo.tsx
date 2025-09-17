import React, { useState, useEffect, useRef } from 'react';
import { INTRO_YOUTUBE_VIDEO_ID, INTRO_YOUTUBE_MUTED, INTRO_YOUTUBE_AUTOPLAY } from '../constants';

// Declare YT on window for TypeScript to avoid errors
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface IntroVideoProps {
  show: boolean;
  onComplete: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ show, onComplete }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null); // To hold the YT.Player instance

  useEffect(() => {
    if (!show || !playerContainerRef.current) {
      return;
    }

    const handleVideoEnd = () => {
      setIsVideoPlaying(false);
    };

    const createPlayer = () => {
      // Ensure we don't create multiple players
      if (playerInstanceRef.current || !playerContainerRef.current) {
        return;
      }
      playerInstanceRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: INTRO_YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: INTRO_YOUTUBE_AUTOPLAY ? 1 : 0,
          controls: INTRO_YOUTUBE_AUTOPLAY ? 0 : 1,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          // FIX: Mute if autoplay is on, as browsers block autoplay with sound.
          // The user's mute setting is respected if autoplay is off.
          mute: (INTRO_YOUTUBE_AUTOPLAY || INTRO_YOUTUBE_MUTED) ? 1 : 0,
          loop: 0,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              handleVideoEnd();
            }
          },
        },
      });
    };
    
    // Load the IFrame Player API code asynchronously.
    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = createPlayer;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
    } else {
      // If API is already loaded, just create the player
      createPlayer();
    }
    
    // Cleanup function to destroy the player when component unmounts or is hidden
    return () => {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.destroy === 'function') {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black flex items-center justify-center animate-fadeIn">
      {/* This div is the container where the YouTube iframe will be injected */}
      <div 
        ref={playerContainerRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col items-center">
        <button
          onClick={onComplete}
          className={`px-10 py-4 font-bold text-xl rounded-lg transition-all duration-500 transform font-orbitron bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 shadow-lg hover:scale-105
            ${isVideoPlaying
              ? 'opacity-0 scale-95 pointer-events-none'
              : 'opacity-100 scale-100 pointer-events-auto'
            }`}
        >
          Ready to explore
        </button>
      </div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        
        /* Ensure the iframe fills its container and covers the area */
        iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default IntroVideo;