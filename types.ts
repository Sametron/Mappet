export interface IslandPosition {
  x: number;
  y: number;
}

export interface IslandConfig extends IslandPosition {
  name: string;
  description: string;
  lore: string;
  undevelopedImg: string;
  activeImg?: string;
  developedImg: string;
  size: number; // in virtual canvas units
  cardImg: string;
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
  url:string;
  alt: string;
  size: number; // height in vh
  tabletSize?: number;
  mobileSize?: number;
}

export interface LoadingGifConfig {
  url: string;
  size: number; // size in pixels (width & height)
  x: number;    // horizontal offset from center in percentage
  y: number;    // vertical offset from center in percentage
}

export type IslandStatus = 'locked' | 'active' | 'unlocked';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type AppPhase = 'loading' | 'ready' | 'intro' | 'exploring';