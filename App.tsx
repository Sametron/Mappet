import React, { useState, useMemo, useCallback, useEffect } from 'react';
import IslandHotspot from './components/IslandHotspot';
import VideoModal from './components/VideoModal';
import IslandInfoModal from './components/IslandInfoModal';
import LoadingScreen from './components/LoadingScreen';
import CompletionScreen from './components/CompletionScreen';
import { BACKGROUND_URL, BRIDGE_URL, BRIDGE_CONFIG, BACKGROUND_SIZE, ISLAND_CONFIGS, VIDEOS, SEQUENTIAL } from './constants';
import type { IslandStatus, DeviceType, IslandConfig } from './types';
import ResetIcon from './components/icons/ResetIcon';
import OrientationLock from './components/OrientationLock';

const MOBILE_BREAKPOINT = 767;
const TABLET_BREAKPOINT = 1024;

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
  const [infoIsland, setInfoIsland] = useState<IslandConfig | null>(null);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<number | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

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
      BRIDGE_URL,
      ...ISLAND_CONFIGS.flatMap(config => [config.undevelopedImg, config.developedImg])
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
      setInfoIsland(ISLAND_CONFIGS[index]);
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
    setInfoIsland(null);
  }, []);

  const getIslandStatus = (index: number): IslandStatus => {
    if (unlockedIslands.includes(index)) return 'unlocked';
    if (SEQUENTIAL) {
      return index === activeIslandIndex ? 'active' : 'locked';
    }
    return 'active';
  };
  
  const bridgeX = getResponsiveValue(BRIDGE_CONFIG.x, deviceType, BRIDGE_CONFIG.mobileX, BRIDGE_CONFIG.tabletX);
  const bridgeY = getResponsiveValue(BRIDGE_CONFIG.y, deviceType, BRIDGE_CONFIG.mobileY, BRIDGE_CONFIG.tabletY);
  const bridgeSize = getResponsiveValue(BRIDGE_CONFIG.size, deviceType, BRIDGE_CONFIG.mobileSize, BRIDGE_CONFIG.tabletSize);

  return (
    <>
      <OrientationLock />
      <LoadingScreen isLoading={isLoading} progress={loadingProgress} />
      <main 
        className={`relative w-screen h-screen overflow-hidden text-white font-inter transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: '#0f2460' }}
      >
        {/* Layer 1: Background Image */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat transition-transform duration-500 ease-in-out"
          style={{ 
            backgroundImage: `url(${BACKGROUND_URL})`,
            backgroundSize: BACKGROUND_SIZE 
          }}
        />

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
              deviceType={deviceType}
            />
          ))}
        </div>

        {/* Layer 3: Bridge Image */}
        <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
          <img
            src={BRIDGE_URL}
            alt=""
            className="absolute"
            style={{
              top: `${bridgeY}%`,
              left: `${bridgeX}%`,
              transform: 'translate(-50%, -50%)',
              width: `${bridgeSize}vmin`,
              opacity: BRIDGE_CONFIG.opacity,
            }}
          />
        </div>

        {/* Layer 4: UI */}
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-30">
          <div>
            <h1 className="text-3xl font-bold font-orbitron tracking-wider text-shadow">BUPA STRATEGY MAP</h1>
            <p className="text-cyan-300">Unlock all strategic locations</p>
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
        
        <style>{`
          .text-shadow { text-shadow: 0 2px 4px rgba(0, 255, 229, 0.5); }
          @keyframes pulse-deep {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(2.5); opacity: 0; }
          }
          .animate-pulse-deep { animation: pulse-deep 2.5s infinite ease-out; }
        `}</style>

        {infoIsland && (
          <IslandInfoModal 
            island={infoIsland} 
            onClose={() => setInfoIsland(null)} 
          />
        )}

        {selectedIsland !== null && VIDEOS[selectedIsland] && (
          <VideoModal
            videoUrl={VIDEOS[selectedIsland]}
            onComplete={handleVideoComplete}
            islandNumber={selectedIsland + 1}
          />
        )}
        
        <CompletionScreen show={isComplete} onReset={handleReset} />
      </main>
    </>
  );
};

export default App;