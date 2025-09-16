export interface IslandPosition {
  x: number;
  y: number;
}

export interface BridgeConfig extends IslandPosition {
    tabletX?: number;
    tabletY?: number;
    tabletSize?: number;
    mobileX?: number;
    mobileY?: number;
    mobileSize?: number;
    size: number; // in vmin
    opacity: number;
}

export interface IslandConfig extends IslandPosition {
  name: string;
  description: string;
  lore: string;
  tabletX?: number;
  tabletY?: number;
  tabletSize?: number;
  mobileX?: number;
  mobileY?: number;
  mobileSize?: number;
  undevelopedImg: string;
  developedImg: string;
  size: number; // in vmin (viewport's smaller dimension)
}

export type IslandStatus = 'locked' | 'active' | 'unlocked';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';