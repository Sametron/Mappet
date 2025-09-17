
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
