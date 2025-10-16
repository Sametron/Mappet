import React, { useState, useMemo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import IslandHotspot from './components/IslandHotspot';
import VideoModal from './components/VideoModal';
import StrategyCardModal from './components/StrategyCardModal';
import ReplayVideoModal from './components/ReplayVideoModal';
import LoadingScreen from './components/LoadingScreen';
import CompletionScreen from './components/CompletionScreen';
import EndingScreen from './components/EndingScreen';
import IntroVideo from './components/IntroVideo';
import { BACKGROUND_URL, START_SCREEN_BACKGROUND_URL, ISLAND_CONFIGS, VIDEOS, SEQUENTIAL, FOOTER_IMAGE_CONFIG, HEADER_LOGO_CONFIG, VIRTUAL_CANVAS_WIDTH, VIRTUAL_CANVAS_HEIGHT, LOADING_GIF_CONFIG, SECOND_INTRO_VIDEO_URL, SECOND_INTRO_VIDEO_MUTED, PROGRESS_INDICATOR_GAP } from './constants';
import type { IslandStatus, DeviceType, IslandConfig, AppPhase } from './types';
import ResetIcon from './components/icons/ResetIcon';
import OrientationLock from './components/OrientationLock';
import FullscreenIcon from './components/icons/FullscreenIcon';

const MOBILE_BREAKPOINT = 767;
const TABLET_BREAKPOINT = 1024;

interface GlobeProps {
  children: React.ReactNode;
}

const Globe: React.FC<GlobeProps> = ({ children }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    const calculateSize = () => {
      const parentWidth = window.innerWidth;
      const parentHeight = window.innerHeight;
      const canvasAspectRatio = VIRTUAL_CANVAS_WIDTH / VIRTUAL_CANVAS_HEIGHT;
      const parentAspectRatio = parentWidth / parentHeight;

      let globeWidth: number;
      let globeHeight: number;

      if (parentAspectRatio > canvasAspectRatio) {
        globeHeight = parentHeight;
        globeWidth = globeHeight * canvasAspectRatio;
      } else {
        globeWidth = parentWidth;
        globeHeight = globeWidth / canvasAspectRatio;
      }

      const globeTop = (parentHeight - globeHeight) / 2;
      const globeLeft = (parentWidth - globeWidth) / 2;

      setStyle({
        position: 'absolute',
        width: `${globeWidth}px`,
        height: `${globeHeight}px`,
        top: `${globeTop}px`,
        left: `${globeLeft}px`,
      });
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  return (
    <div style={style}>
      <div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BACKGROUND_URL})`,
          backgroundSize: '100% 100%',
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};


const getResponsiveValue = <T,>(
  desktopVal: T,
  deviceType: DeviceType,
  mobileVal?: T,
  tabletVal?: T
): T => {
  if (deviceType === 'mobile' && typeof mobileVal !== 'undefined') {
    return mobileVal;
  }
  if (deviceType === 'tablet' && typeof tabletVal !== 'undefined') {
    return tabletVal;
  }
  return desktopVal;
};

const App: React.FC = () => {
  const [appPhase, setAppPhase] = useState<AppPhase>('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [unlockedIslands, setUnlockedIslands] = useState<number[]>([]);
  const [selectedIsland, setSelectedIsland] = useState<number | null>(null);
  const [strategyCardIsland, setStrategyCardIsland] = useState<IslandConfig | null>(null);
  const [replayingIslandIndex, setReplayingIslandIndex] = useState<number | null>(null);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<number | null>(null);
  const [newlyActiveIsland, setNewlyActiveIsland] = useState<number | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [completionScreenDismissed, setCompletionScreenDismissed] = useState(false);
  const [completionPhase, setCompletionPhase] = useState<'none' | 'cards' | 'ending'>('none');
  const [isSecondIntroPlaying, setIsSecondIntroPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const secondIntroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= MOBILE_BREAKPOINT) {
        setDeviceType('mobile');
      } else if (width <= TABLET_BREAKPOINT) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const imageUrls = [
      LOADING_GIF_CONFIG.url,
      BACKGROUND_URL,
      START_SCREEN_BACKGROUND_URL,
      HEADER_LOGO_CONFIG.url,
      FOOTER_IMAGE_CONFIG.url,
      ...ISLAND_CONFIGS.flatMap(config => [config.undevelopedImg, config.developedImg, config.activeImg, config.cardImg]).filter(Boolean) as string[]
    ];

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    if (totalImages === 0) {
        setAppPhase('ready');
        return;
    }

    const onImageLoad = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / totalImages) * 100);
      setLoadingProgress(progress);

      if (loadedCount === totalImages) {
        // A brief delay to prevent flashing if loading is too fast
        setTimeout(() => setAppPhase('ready'), 500);
      }
    };

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = onImageLoad;
      img.onerror = onImageLoad; // Treat error as loaded so app doesn't hang
    });
  }, []);
  
  useEffect(() => {
    const video = secondIntroVideoRef.current;
    if (!video || appPhase !== 'secondIntro') return;

    const handlePlay = () => setIsSecondIntroPlaying(true);
    const handlePause = () => setIsSecondIntroPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [appPhase]);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);


  const isComplete = unlockedIslands.length === ISLAND_CONFIGS.length;
  
  useEffect(() => {
    if (isComplete && !completionScreenDismissed) {
      if (completionPhase === 'none') {
        setCompletionPhase('cards');
      }
    } else {
      setCompletionPhase('none');
    }
  }, [isComplete, completionScreenDismissed, completionPhase]);

  const activeIslandIndex = useMemo(() => {
    if (isComplete || !SEQUENTIAL) return -1;
    return unlockedIslands.length;
  }, [unlockedIslands, isComplete]);

  const handleHotspotClick = useCallback((index: number) => {
    const isUnlocked = unlockedIslands.includes(index);
    const isActive = SEQUENTIAL ? index === activeIslandIndex : true;

    if (isUnlocked) {
      setStrategyCardIsland(ISLAND_CONFIGS[index]);
    } else if (isActive) {
      setSelectedIsland(index);
    }
  }, [unlockedIslands, activeIslandIndex]);

  const handleVideoComplete = useCallback(() => {
    if (selectedIsland !== null) {
      const justUnlocked = selectedIsland;
      
      setUnlockedIslands(prev => {
        const newUnlocked = [...prev, justUnlocked].sort((a, b) => a - b);
        const nextActiveIndex = newUnlocked.length;
        if (SEQUENTIAL && nextActiveIndex < ISLAND_CONFIGS.length) {
            setNewlyActiveIsland(nextActiveIndex);
        }
        return newUnlocked;
      });

      setSelectedIsland(null);
      setRecentlyUnlocked(justUnlocked);
      
      // Clear animation trigger states after a delay
      setTimeout(() => {
        setRecentlyUnlocked(null);
        setNewlyActiveIsland(null);
      }, 1200);
    }
  }, [selectedIsland]);

  const handleReset = useCallback(() => {
    setUnlockedIslands([]);
    setSelectedIsland(null);
    setStrategyCardIsland(null);
    setCompletionScreenDismissed(false);
  }, []);

  const handleCompletionClose = useCallback(() => {
    setCompletionScreenDismissed(true);
  }, []);

  const handleCompletionAnimationEnd = useCallback(() => {
    setCompletionPhase('ending');
  }, []);
  
  const handleIntroComplete = useCallback(() => setAppPhase('secondIntroPrompt'), []);
  
  const handleSecondIntroComplete = useCallback(() => setAppPhase('exploring'), []);
  
  const handleStartSecondIntro = useCallback(() => {
    const video = secondIntroVideoRef.current;
    if (video) {
        video.muted = SECOND_INTRO_VIDEO_MUTED;
        video.loop = false;
        video.currentTime = 0;
        video.play().catch(error => {
            console.warn("Second intro video playback failed. Skipping.", error);
            handleSecondIntroComplete();
        });
        setAppPhase('secondIntro');
    }
  }, [handleSecondIntroComplete]);

  const handleSkipSecondIntro = useCallback(() => {
    const video = secondIntroVideoRef.current;
    if (video) {
        video.pause();
    }
    handleSecondIntroComplete();
  }, [handleSecondIntroComplete]);
  
  const handleWatchAgain = useCallback(() => {
    if (strategyCardIsland) {
      const islandIndex = ISLAND_CONFIGS.findIndex(c => c.name === strategyCardIsland.name);
      if (islandIndex !== -1) {
        setStrategyCardIsland(null); // Close the card modal first
        // A small delay to allow the card modal to animate out before the video modal animates in
        setTimeout(() => {
          setReplayingIslandIndex(islandIndex);
        }, 300);
      }
    }
  }, [strategyCardIsland]);

  const toggleSecondIntroPlayPause = useCallback(() => {
    const video = secondIntroVideoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(error => console.error("Video play failed:", error));
      } else {
        video.pause();
      }
    }
  }, []);
  
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  const handleStart = useCallback(() => setAppPhase('intro'), []);

  const getIslandStatus = (index: number): IslandStatus => {
    if (unlockedIslands.includes(index)) return 'unlocked';
    if (SEQUENTIAL) {
      return index === activeIslandIndex ? 'active' : 'locked';
    }
    return 'active';
  };
  
  const footerY = getResponsiveValue(FOOTER_IMAGE_CONFIG.y, deviceType, FOOTER_IMAGE_CONFIG.mobileY, FOOTER_IMAGE_CONFIG.tabletY);
  const footerMaxHeight = getResponsiveValue(FOOTER_IMAGE_CONFIG.size, deviceType, FOOTER_IMAGE_CONFIG.mobileSize, FOOTER_IMAGE_CONFIG.tabletSize);
  
  const logoHeight = getResponsiveValue(HEADER_LOGO_CONFIG.size, deviceType, HEADER_LOGO_CONFIG.mobileSize, HEADER_LOGO_CONFIG.tabletSize);
  
  const showMainApp = appPhase === 'exploring';

  return (
    <>
      <OrientationLock />
      <LoadingScreen isLoading={appPhase === 'loading'} progress={loadingProgress} />

      {appPhase === 'ready' && (
        <div
            className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-cover bg-center transition-opacity duration-1000 animate-fadeIn"
            style={{ backgroundImage: `url(${START_SCREEN_BACKGROUND_URL})` }}
        >
            {/* Vignette Overlay */}
            <div 
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(15, 36, 96, 0.95) 80%)' }}
            ></div>
            
            {/* Mission Briefing Panel */}
            <div className="relative z-10 text-center text-white max-w-3xl mx-4">
                <div className="bg-black/40 backdrop-blur-lg border border-cyan-500/20 rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative corners */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-xl opacity-50"></div>
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-xl opacity-50"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-xl opacity-50"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400/50 rounded-br-xl opacity-50"></div>
                    
                    <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
                        <img
                            src={HEADER_LOGO_CONFIG.url}
                            alt={HEADER_LOGO_CONFIG.alt}
                            className="mx-auto mb-6"
                            style={{ height: `${logoHeight}vh`, maxHeight: '80px' }}
                        />
                        <h1 className="text-4xl md:text-5xl font-black font-orbitron tracking-wider text-shadow-glow mb-4">
                            BHK Big 5
                        </h1>
                    </div>

                    <div className="animate-slideUp" style={{ animationDelay: '0.5s' }}>
                        <p className="text-lg md:text-xl text-cyan-200/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                           Explore how Bupa HK is becoming the #1 Integrated Healthcare Company in Hong Kong through growth as a funder, expanding as an outpatient service provider & building strategic inpatient partnerships, with data, digital and technological capabilities, thereby achieving $1bn profit.

                        </p>
                    </div>
                    
                    <div className="animate-slideUp" style={{ animationDelay: '0.7s' }}>
                        <button
                            onClick={handleStart}
                            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/50 ring-offset-2 ring-offset-gray-900"
                            aria-label="BEGIN THE SAFARI"
                        >
                            BEGIN THE SAFARI
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <IntroVideo show={appPhase === 'intro'} onComplete={handleIntroComplete} />
      
      {(appPhase === 'secondIntroPrompt' || appPhase === 'secondIntro') && (
        <div className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-black animate-fadeIn">
          <video
            ref={secondIntroVideoRef}
            src={SECOND_INTRO_VIDEO_URL}
            onEnded={handleSecondIntroComplete}
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />

          {appPhase === 'secondIntroPrompt' && (
            <>
              <div 
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.8) 80%)' }}
              ></div>
              
              <div className="relative z-10 text-center text-white max-w-3xl mx-4">
                  <div className="bg-black/40 backdrop-blur-lg border border-cyan-500/20 rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden animate-slideUp">
                      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-xl opacity-50"></div>
                      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-xl opacity-50"></div>
                      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-xl opacity-50"></div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400/50 rounded-br-xl opacity-50"></div>
                      <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-white text-shadow-glow mb-8">
                          Every box takes us closer to the future.
                      </h2>
                      <button
                          onClick={handleStartSecondIntro}
                          className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/50 ring-offset-2 ring-offset-gray-900"
                          aria-label="Unbox now"
                      >
                          Unbox now
                      </button>
                  </div>
              </div>
            </>
          )}

          {appPhase === 'secondIntro' && (
            <>
              <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
                <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3 animate-fadeInDelayed">
                  <button
                    onClick={toggleSecondIntroPlayPause}
                    className="px-4 py-2 bg-black/50 backdrop-blur-sm text-white/80 rounded-lg border border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 text-sm"
                    aria-label={isSecondIntroPlaying ? 'Pause intro video' : 'Play intro video'}
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      {isSecondIntroPlaying ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                          PAUSE
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          PLAY
                        </>
                      )}
                    </span>
                  </button>
                  <button
                      onClick={handleSkipSecondIntro}
                      className="px-5 py-2 bg-black/50 backdrop-blur-sm text-white/80 rounded-lg border border-white/30 hover:bg-white/20 hover:text-white transition-all duration-300 text-sm"
                      aria-label="Skip introduction video"
                  >
                      <span className="flex items-center gap-2 font-semibold">
                          SKIP
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                      </span>
                  </button>
                </div>
            </>
          )}
        </div>
      )}
      
      <main 
        className={`relative w-screen h-screen overflow-hidden text-white font-inter transition-opacity duration-1000 ${showMainApp ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: '#0f2460' }}
        aria-hidden={!showMainApp}
      >
        <Globe>
          {/* Layer 2: Hotspots */}
          <div className="absolute inset-0 z-40">
            {ISLAND_CONFIGS.map((config, index) => (
              <IslandHotspot
                key={index}
                index={index}
                config={config}
                status={getIslandStatus(index)}
                onClick={() => handleHotspotClick(index)}
                isRecentlyUnlocked={recentlyUnlocked === index}
              />
            ))}
          </div>
        </Globe>

        {/* Layer 4: UI */}
        <header className="absolute top-0 left-0 p-4 md:p-6 z-30">
            <div className="flex items-center gap-2 md:gap-4">
                <img 
                src={HEADER_LOGO_CONFIG.url} 
                alt={HEADER_LOGO_CONFIG.alt}
                className="max-h-[40px] md:max-h-none"
                style={{ height: `${logoHeight}vh` }}
                />
                <div>
                <h1 className="text-lg md:text-3xl font-bold font-orbitron tracking-wider text-shadow">BUPA STRATEGY MAP</h1>
                <p className="text-xs md:text-base text-cyan-300">Unlock all strategic locations</p>
                </div>
            </div>
        </header>
        
        <div className="absolute top-0 right-0 p-4 md:p-6 z-30 flex flex-row gap-4">
            <button
            onClick={handleReset}
            aria-label="Reset progress"
            className="p-2 md:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
            <ResetIcon className="w-5 h-5 md:w-6 md:h-6"/>
            </button>
            <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
                className="p-2 md:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
                <FullscreenIcon isFullscreen={isFullscreen} className="w-5 h-5 md:w-6 md:h-6"/>
            </button>
        </div>

        <div className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 z-30 text-right">
            <span className="text-xl md:text-2xl font-bold font-orbitron">{unlockedIslands.length} / {ISLAND_CONFIGS.length}</span>
            <div 
              className="relative flex flex-col items-center mt-2" 
              role="group" 
              aria-label="Mission Progress"
              style={{ gap: `${PROGRESS_INDICATOR_GAP}px` }}
            >
                <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-0.5 bg-cyan-500/20 rounded-full" aria-hidden="true"></div>
                {ISLAND_CONFIGS.map((island, index) => {
                    const status = getIslandStatus(index);
                    const isUnlocked = status === 'unlocked';
                    const isActive = status === 'active';

                    const isNewlyUnlocked = recentlyUnlocked === index;
                    const isNewlyActive = newlyActiveIsland === index;
                    const animationClass = (isNewlyUnlocked || isNewlyActive) ? 'animate-pulse-scale-once' : '';

                    return (
                    <button
                        key={index}
                        onClick={() => isUnlocked && setStrategyCardIsland(island)}
                        disabled={!isUnlocked}
                        className={`relative w-6 h-6 md:w-8 md:h-8 rounded-full border-2 transition-all duration-300 group flex items-center justify-center ${
                        isUnlocked 
                            ? 'bg-cyan-500/80 border-cyan-400 cursor-pointer hover:bg-cyan-400 hover:scale-110' 
                            : isActive 
                            ? 'bg-transparent border-cyan-400 animate-pulse-glow-border' 
                            : 'bg-gray-800/50 border-gray-600 cursor-not-allowed'
                        } ${animationClass}`}
                        aria-label={
                        isUnlocked 
                            ? `View strategy for ${island.name}` 
                            : isActive 
                            ? `${island.name} is the next objective`
                            : `${island.name} is locked`
                        }
                    >
                        {isUnlocked ? (
                        <span className="text-white font-bold text-xs md:text-sm select-none">
                            {index + 1}
                        </span>
                        ) : isActive ? (
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-cyan-400"></div>
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        )}
                        {/* Tooltip */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-max max-w-xs p-2 bg-gray-900/80 backdrop-blur-sm rounded-md text-white text-xs text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                        {island.name}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-gray-900/80"></div>
                        </div>
                    </button>
                    );
                })}
              </div>
        </div>

        <footer 
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-30" 
          aria-hidden="true"
          style={{ bottom: `${footerY}%` }}
        >
          <img
            src={FOOTER_IMAGE_CONFIG.url}
            alt={FOOTER_IMAGE_CONFIG.alt}
            className="w-full h-auto object-contain"
            style={{
              maxHeight: `${footerMaxHeight}vmin`,
            }}
          />
        </footer>
        
        <style>{`
          .text-shadow { text-shadow: 0 2px 4px rgba(0, 255, 229, 0.5); }
          .text-shadow-glow { text-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3); }
          @keyframes pulse-deep {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(2.5); opacity: 0; }
          }
          .animate-pulse-deep { animation: pulse-deep 2.5s infinite ease-out; }
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
          @keyframes fadeInDelayed {
            0% { opacity: 0; transform: translateY(10px); }
            66% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInDelayed { animation: fadeInDelayed 3s ease-out forwards; }
          @keyframes pulse-glow-border {
            0%, 100% { box-shadow: 0 0 3px 0px rgba(0, 255, 255, 0.5); }
            50% { box-shadow: 0 0 8px 2px rgba(0, 255, 255, 1); }
          }
          .animate-pulse-glow-border { animation: pulse-glow-border 2s infinite ease-in-out; }
          
          @keyframes pulse-scale-once {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.25); }
          }
          .animate-pulse-scale-once {
            animation: pulse-scale-once 0.8s ease-in-out;
          }
        `}</style>

        {strategyCardIsland && (
          <StrategyCardModal 
            island={strategyCardIsland} 
            onClose={() => setStrategyCardIsland(null)} 
            onWatchAgain={handleWatchAgain}
          />
        )}
        
        {replayingIslandIndex !== null && VIDEOS[replayingIslandIndex] && (
            <ReplayVideoModal
                videoUrl={VIDEOS[replayingIslandIndex]}
                islandName={ISLAND_CONFIGS[replayingIslandIndex].name}
                onClose={() => setReplayingIslandIndex(null)}
            />
        )}

        {selectedIsland !== null && VIDEOS[selectedIsland] && (
          <VideoModal
            videoUrl={VIDEOS[selectedIsland]}
            onComplete={handleVideoComplete}
            islandNumber={selectedIsland + 1}
            island={ISLAND_CONFIGS[selectedIsland]}
          />
        )}
        
        <CompletionScreen 
          show={completionPhase === 'cards'}
          onAnimationComplete={handleCompletionAnimationEnd}
        />
        
        <EndingScreen 
          show={completionPhase === 'ending'} 
          onPlayAgain={handleReset}
          onClose={handleCompletionClose}
        />
      </main>
    </>
  );
};

export default App;