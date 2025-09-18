import React, { useEffect, useRef } from 'react';
import { INTRO_VIDEO_URL, INTRO_VIDEO_MUTED } from '../constants';

interface IntroVideoProps {
  show: boolean;
  onComplete: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ show, onComplete }) => {
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

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black flex items-center justify-center animate-fadeIn">
      <video
        ref={videoRef}
        src={INTRO_VIDEO_URL}
        onEnded={onComplete}
        muted={INTRO_VIDEO_MUTED}
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        aria-label="Introduction video"
      />
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default IntroVideo;