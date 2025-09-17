import type { IslandPosition, IslandConfig, FooterImageConfig, HeaderLogoConfig } from './types';

// The main background image URL
export const BACKGROUND_URL: string = 'https://i.imgur.com/SSdiUoB.png'; // A square fantasy map background

// Virtual canvas dimensions for a fixed coordinate system
export const VIRTUAL_CANVAS_WIDTH: number = 1024;
export const VIRTUAL_CANVAS_HEIGHT: number = 1024;

// Controls the background image size. Common values: 'cover', 'contain', '100% 100%'
export const BACKGROUND_SIZE: string = 'contain';

// Central tower's coordinates (for reference, not used directly in this setup)
export const CENTER: IslandPosition = { x: 512, y: 512 };

// Configuration for the header logo
export const HEADER_LOGO_CONFIG: HeaderLogoConfig = {
  url: 'https://i.imgur.com/69Xk6nh.png', // A simple, white abstract logo
  alt: 'Bupa Strategy Logo',
  size: 10, // height in vh
  tabletSize: 10,
  mobileSize: 10,
};

// Configuration for each of the six islands, each with unique images, positions, and sizes in virtual coordinates
export const ISLAND_CONFIGS: IslandConfig[] = [
  { 
    x: 440, y: 160, size: 360,
    name: 'Customer Growth',
    description: 'Stretch further into the mass affluent as a funder and partner with non-compete insurers. Be a partner of choice for the Government to capture PPP spending. Expanding alternative funding products (e.g. subscription plan) to drive retention and access to our healthcare ecosystem.',
    lore: 'Stretch further into the mass affluent as a funder and partner with non-compete insurers. Be a partner of choice for the Government to capture PPP spending. Expanding alternative funding products (e.g. subscription plan) to drive retention and access to our healthcare ecosystem.',
    undevelopedImg: 'https://i.imgur.com/wdhqCSg.png',
    activeImg: 'https://i.imgur.com/gKrZjiC.gif',
    developedImg: 'https://i.imgur.com/8sVxmY4.png',
    cardImg: 'https://i.imgur.com/x6xEKxV.png' // Glowing Tree Card
  },
  { 
    x: 740, y: 275, size: 360,
    name: 'Outpatient Expansion',
    description: 'Invest in expanding our owned outpatient capacity, capturing broader footprint and enlarged clinics with a customer-centric design.',
    lore: 'Invest in expanding our owned outpatient capacity, capturing broader footprint and enlarged clinics with a customer-centric design.',
    undevelopedImg: 'https://i.imgur.com/QS97oit.png',
    activeImg: 'https://i.imgur.com/BefTGU5.gif',
    developedImg: 'https://i.imgur.com/P7UZuOW.png',
    cardImg: 'https://i.imgur.com/E2gCoBW.png' // Floating Crystal Mountain Card
  },
   { 
    x: 240, y: 330, size: 320,
    name: 'Outpatient M&A',
    description: 'Pursue inorganic opportunities to more than double our market share to 20%',
    lore: 'Pursue inorganic opportunities to more than double our market share to 20%',
    undevelopedImg: 'https://i.imgur.com/qa9ht0W.png',
    activeImg: 'https://i.imgur.com/ov1FkcP.gif',
    developedImg: 'https://i.imgur.com/udu1W78.png',
    cardImg: 'https://i.imgur.com/gUAYd3C.png' // Icy Fortress Card
  },
  { 
    x: 500, y: 820, size: 340,
    name: 'Hospital Strategy',
    description: 'Develop steerage for inpatient management.',
    lore: 'Develop steerage for inpatient management.',
    undevelopedImg: 'https://i.imgur.com/Ge6A2rq.png',
    activeImg: 'https://i.imgur.com/5DLzFB3.gif',
    developedImg: 'https://i.imgur.com/AkR7Bnz.png',
    cardImg: 'https://i.imgur.com/WLCQly5.png' // Mystical Oasis Card
  },
  {
    x: 260, y: 700, size: 320,
    name: 'Digital Healthcare Journey',
    description: 'Experience a tailored healthcare journey with a Personalised Health Plan on Blua. Comprehensive support and access to a wide range of services designed for each customer’s unique needs.',
    lore: 'Experience a tailored healthcare journey with a Personalised Health Plan on Blua. Comprehensive support and access to a wide range of services designed for each customer’s unique needs.',
    undevelopedImg: 'https://i.imgur.com/ArVh2pk.png',
    activeImg: 'https://i.imgur.com/16n1gpg.gif',
    developedImg: 'https://i.imgur.com/PPOHwDV.png',
    cardImg: 'https://i.imgur.com/FTlubZ4.png' // Volcanic Forge Card
  },
    { 
    x: 720, y: 720, size: 320,
    name: '4X Profit',
    description: 'Drive operational excellence and innovative service delivery to achieve a fourfold increase in profitability, while aiming to acquire and engage 100 million customers to solidify our leadership position in the healthcare sector.',
    lore: 'Drive operational excellence and innovative service delivery to achieve a fourfold increase in profitability, while aiming to acquire and engage 100 million customers to solidify our leadership position in the healthcare sector.',
    undevelopedImg: 'https://i.imgur.com/ipgx27U.png',
    activeImg: 'https://i.imgur.com/VfuHRUW.gif',
    developedImg: 'https://i.imgur.com/QE0a09o.png',
    cardImg: 'https://i.imgur.com/KFnE4bl.png' // Celestial Gateway Card
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