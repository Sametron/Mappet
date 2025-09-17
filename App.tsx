import React, { useState, useMemo, useCallback, useEffect, useLayoutEffect } from 'react';
import IslandHotspot from './components/IslandHotspot';
import VideoModal from './components/VideoModal';
import StrategyCardModal from './components/StrategyCardModal';
import LoadingScreen from './components/LoadingScreen';
import CompletionScreen from './components/CompletionScreen';
import { BACKGROUND_URL, ISLAND_CONFIGS, VIDEOS, SEQUENTIAL, FOOTER_IMAGE_CONFIG, HEADER_LOGO_CONFIG, VIRTUAL_CANVAS_WIDTH, VIRTUAL_CANVAS_HEIGHT } from './constants';
import type { IslandStatus, DeviceType, IslandConfig } from './types';
import ResetIcon from './components/icons/ResetIcon';
import OrientationLock from './components/OrientationLock';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [unlockedIslands, setUnlockedIslands] = useState<number[]>([]);
  const [selectedIsland, setSelectedIsland] = useState<number | null>(null);
  const [strategyCardIsland, setStrategyCardIsland] = useState<IslandConfig | null>(null);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<number | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [completionScreenDismissed, setCompletionScreenDismissed] = useState(false);

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
      BACKGROUND_URL,
      HEADER_LOGO_CONFIG.url,
      FOOTER_IMAGE_CONFIG.url,
      ...ISLAND_CONFIGS.flatMap(config => [config.undevelopedImg, config.developedImg, config.activeImg, config.cardImg]).filter(Boolean) as string[]
    ];

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    if (totalImages === 0) {
        setIsLoading(false);
        return;
    }

    const onImageLoad = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / totalImages) * 100);
      setLoadingProgress(progress);

      if (loadedCount === totalImages) {
        // A brief delay to prevent flashing if loading is too fast
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = onImageLoad;
      img.onerror = onImageLoad; // Treat error as loaded so app doesn't hang
    });
  }, []);

  const isComplete = unlockedIslands.length === ISLAND_CONFIGS.length;

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
      setUnlockedIslands(prev => [...prev, justUnlocked].sort((a, b) => a - b));
      setSelectedIsland(null);
      setRecentlyUnlocked(justUnlocked);
      setTimeout(() => {
        setRecentlyUnlocked(null);
      }, 1200);
    }
  }, [selectedIsland]);

  const handleReset = useCallback(() => {
    setUnlockedIslands([]);
    setSelectedIsland(null);
    setStrategyCardIsland(null);
    setCompletionScreenDismissed(false);
  }, []);

  const handleCloseCompletion = () => setCompletionScreenDismissed(true);

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

  return (
    <>
      <OrientationLock />
      <LoadingScreen isLoading={isLoading} progress={loadingProgress} />
      <main 
        className={`relative w-screen h-screen overflow-hidden text-white font-inter transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: '#0f2460' }}
      >
        <Globe>
          {/* Layer 2: Hotspots */}
          <div className="absolute inset-0 z-10">
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

          {/* Layer 3: Spotlight Overlay Effect */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
                background: 'radial-gradient(circle at center, transparent 45%, rgba(15, 36, 96, 0.6) 75%)'
            }}
            aria-hidden="true"
          />
        </Globe>

        {/* Layer 4: UI */}
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-30">
          <div className="flex items-center gap-4">
            <img 
              src={HEADER_LOGO_CONFIG.url} 
              alt={HEADER_LOGO_CONFIG.alt}
              style={{ height: `${logoHeight}vh` }}
            />
            <div>
              <h1 className="text-3xl font-bold font-orbitron tracking-wider text-shadow">BUPA STRATEGY MAP</h1>
              <p className="text-cyan-300">Unlock all strategic locations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className='text-right'>
              <span className="text-2xl font-bold font-orbitron">{unlockedIslands.length} / {ISLAND_CONFIGS.length}</span>
              <div className="w-48 h-2 bg-gray-700 rounded-full mt-1">
                <div
                  className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(unlockedIslands.length / ISLAND_CONFIGS.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={handleReset}
              aria-label="Reset progress"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <ResetIcon className="w-6 h-6"/>
            </button>
          </div>
        </header>

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
              // FIX: Corrected variable name from `maxHeight` to `footerMaxHeight`
              maxHeight: `${footerMaxHeight}vmin`,
            }}
          />
        </footer>
        
        <style>{`
          .text-shadow { text-shadow: 0 2px 4px rgba(0, 255, 229, 0.5); }
          @keyframes pulse-deep {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(2.5); opacity: 0; }
          }
          .animate-pulse-deep { animation: pulse-deep 2.5s infinite ease-out; }
        `}</style>

        {strategyCardIsland && (
          <StrategyCardModal 
            island={strategyCardIsland} 
            onClose={() => setStrategyCardIsland(null)} 
          />
        )}

        {selectedIsland !== null && VIDEOS[selectedIsland] && (
          <VideoModal
            videoUrl={VIDEOS[selectedIsland]}
            onComplete={handleVideoComplete}
            islandNumber={selectedIsland + 1}
          />
        )}
        
        <CompletionScreen show={isComplete && !completionScreenDismissed} onClose={handleCloseCompletion} />
      </main>
    </>
  );
};

export default App;