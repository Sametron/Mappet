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
  activeImg?: string;
  developedImg: string;
  size: number; // in vmin (viewport's smaller dimension)
}

export interface FooterImageConfig {
  url: string;
  alt: string;
  y: number;
  size: number; // max-height in vmin
  tabletY?: number;
  tabletSize?: number;
  mobileY?: number;
  mobileSize?: number;
}

export interface HeaderLogoConfig {
  url: string;
  alt: string;
  size: number; // height in vh
  tabletSize?: number;
  mobileSize?: number;
}

export type IslandStatus = 'locked' | 'active' | 'unlocked';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';