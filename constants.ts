import type { IslandPosition, IslandConfig, BridgeConfig, FooterImageConfig, HeaderLogoConfig } from './types';

// The main background image URL
export const BACKGROUND_URL: string = 'https://i.imgur.com/SSdiUoB.png?q=80&w=1974&auto=format&fit=crop'; // A fantasy map background

// Bridge image URL
export const BRIDGE_URL: string = 'https://i.imgur.com/K5FmFIO.png'; // A stone bridge overlay

// Configuration for the bridge overlay
export const BRIDGE_CONFIG: BridgeConfig = {
  x: 57, // horizontal position in percentage
  y: 51, // vertical position in percentage
  size: 8, // size in vmin (viewport's smaller dimension)
  opacity: 1,
  tabletX: 60,
  tabletY: 51,
  tabletSize: 8,
  mobileX: 57,
  mobileY: 51,
  mobileSize: 8,
};

// Controls the background image size. Common values: 'cover', 'contain', '100% 100%'
export const BACKGROUND_SIZE: string = 'contain';

// Central tower's coordinates in percentage
export const CENTER: IslandPosition = { x: 50, y: 55 };

// Configuration for the header logo
export const HEADER_LOGO_CONFIG: HeaderLogoConfig = {
  url: 'https://i.imgur.com/69Xk6nh.png', // A simple, white abstract logo
  alt: 'Bupa Strategy Logo',
  size: 10, // height in vh
  tabletSize: 10,
  mobileSize: 10,
};

// Configuration for each of the six islands, each with unique images, positions, and sizes
export const ISLAND_CONFIGS: IslandConfig[] = [
  { 
    x: 45, y: 17, size: 35,
    tabletX: 44, tabletY: 17, tabletSize: 35,
    mobileX: 45, mobileY: 17, mobileSize: 35,
    name: 'The Whispering Glades',
    description: 'A vibrant hub of bio-energy. Securing this location allows us to harness natural growth cycles, accelerating resource production and regeneration across all sectors.',
    lore: 'Ancient tales speak of a slumbering forest spirit that nurtures the land. Every rustle of leaves is said to be a whisper of forgotten strategies.',
    undevelopedImg: 'https://i.imgur.com/wdhqCSg.png', // Grassy undeveloped (static)
    activeImg: 'https://i.imgur.com/gKrZjiC.gif',      // Grassy undeveloped (animated)
    developedImg: 'https://i.imgur.com/P77KdBm.png'   // Grassy developed with hut
  },
  { 
    x: 62, y: 27, size: 38,
    tabletX: 66, tabletY: 27, tabletSize: 38,
    mobileX: 62, mobileY: 27, mobileSize: 38,
    name: 'The Sky-Piercer Spire',
    description: 'This commanding geological formation provides unparalleled surveillance and communication advantages. Its height is key to establishing a long-range strategic network.',
    lore: 'It is said that on a clear day, one can see the curvature of the world from its peak, granting a perspective that has inspired conquerors and visionaries alike.',
    undevelopedImg: 'https://i.imgur.com/QS97oit.png', // Rocky undeveloped
    activeImg: 'https://i.imgur.com/BefTGU5.gif',      // Rocky active
    developedImg: 'https://i.imgur.com/PehaeTj.png'   // Rocky developed with tower
  },
   { 
    x: 35, y: 33, size: 30,
    tabletX: 30, tabletY: 33, tabletSize: 29,
    mobileX: 35, mobileY: 33, mobileSize: 30,
    name: 'The Crystal Citadel',
    description: 'These crystalline structures are natural data storage units, holding vast amounts of information. Accessing them is crucial for our intelligence and research divisions.',
    lore: 'The Citadel hums with a low frequency, singing the song of eons. Listeners claim to hear echoes of the past and whispers of the future in its vibrations.',
    undevelopedImg: 'https://i.imgur.com/qa9ht0W.png', // Icy undeveloped
    activeImg: 'https://i.imgur.com/ov1FkcP.gif',      // Icy active
    developedImg: 'https://i.imgur.com/tAb3B6R.png'   // Icy developed with palace
  },
  { 
    x: 50, y: 81, size: 30,
    tabletX: 50, tabletY: 81, tabletSize: 29,
    mobileX: 50, mobileY: 81, mobileSize: 30,
    name: 'The Sunken Cove of Secrets',
    description: 'This location houses submerged relics of a past civilization, containing lost technologies. Its retrieval is paramount for our next wave of innovation.',
    lore: 'The tides here ebb and flow with an unnatural rhythm, revealing and concealing the ruins as if protecting the secrets of those who came before.',
    undevelopedImg: 'https://i.imgur.com/Ge6A2rq.png', // Sandy undeveloped
    activeImg: 'https://i.imgur.com/5DLzFB3.gif',      // Sandy active
    developedImg: 'https://i.imgur.com/uQzA1T0.png'   // Sandy developed with cove
  },
  {
    x: 37, y: 67, size: 32,
    tabletX: 33, tabletY: 67, tabletSize: 31,
    mobileX: 37, mobileY: 67, mobileSize: 32,
    name: 'The Emberforge',
    description: 'A nexus of geothermal power. The Emberforge is the only place with the resources and heat necessary to craft our most advanced alloys and power cores.',
    lore: 'It is believed the island is the cooling shell of a great beast, its heart still burning with immense power deep below the surface.',
    undevelopedImg: 'https://i.imgur.com/ArVh2pk.png', // Volcanic undeveloped
    activeImg: 'https://i.imgur.com/16n1gpg.gif',      // Volcanic active
    developedImg: 'https://i.imgur.com/GfthALE.png'   // Volcanic developed with forge
  },
    { 
    x: 62, y: 72, size: 30,
    tabletX: 66, tabletY: 72, tabletSize: 29,
    mobileX: 62, mobileY: 72, mobileSize: 30,
    name: 'The Verdant Labyrinth',
    description: 'A dense, confusing woodland that is ideal for covert operations and ambushes. Mastering its winding paths gives us a powerful defensive and tactical advantage.',
    lore: 'The trees themselves are rumored to shift their positions, guiding the worthy and confounding intruders. Only those with true clarity of purpose can navigate its depths.',
    undevelopedImg: 'https://i.imgur.com/ipgx27U.png', // Forest undeveloped
    activeImg: 'https://i.imgur.com/VfuHRUW.gif',      // Forest active
    developedImg: 'https://i.imgur.com/BNrX1RN.png'   // Forest developed with structure
  },
 
];

// Optional list of MP4 links for each island
// Using short, generic videos for demonstration
export const VIDEOS: string[] = [
  "https://cdn.pixabay.com/video/2023/08/24/176313-858348842_large.mp4",
  "https://cdn.pixabay.com/video/2023/09/26/179572-868619623_large.mp4",
  "https://cdn.pixabay.com/video/2023/03/20/153655-807770177_large.mp4",
  "https://cdn.pixabay.com/video/2024/02/12/198270-911896728_large.mp4",
  "https://cdn.pixabay.com/video/2023/01/29/147819-794503251_large.mp4",
  "https://cdn.pixabay.com/video/2023/06/13/166316-836775990_large.mp4",
];

// Configuration for the footer image
export const FOOTER_IMAGE_CONFIG: FooterImageConfig = {
  url: 'https://i.imgur.com/VR4nqDe.png',
  alt: 'Bupa Logo',
  y: 2,       // vertical offset from bottom in percentage
  size: 22,  // max-height in vmin
  tabletY: 2,
  tabletSize: 16,
  mobileY: 2,
  mobileSize: 22,
};

// Enforces one-by-one island unlocking if true
export const SEQUENTIAL: boolean = true;