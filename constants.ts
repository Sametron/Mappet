import type { IslandPosition, IslandConfig, FooterImageConfig, HeaderLogoConfig, LoadingGifConfig } from './types';

// The main background image URL for the map view
export const BACKGROUND_URL: string = 'https://big5hk.vercel.app/images/map.png'; // A square fantasy map background

// The background for the 'Mission Briefing' start screen
export const START_SCREEN_BACKGROUND_URL: string = 'https://big5hk.vercel.app/images/startbg.png'; // A dark, abstract, tech-focused background

// New configuration object for the loading GIF
export const LOADING_GIF_CONFIG: LoadingGifConfig = {
  url: 'https://big5hk.vercel.app/images/animatedloader.gif',
  size: 300, // Corresponds to Tailwind's w-32/h-32 (128px)
  x: 0,    // 0% offset, perfectly centered horizontally
  y: 0,    // 0% offset, perfectly centered vertically
};

// Virtual canvas dimensions for a fixed coordinate system
export const VIRTUAL_CANVAS_WIDTH: number = 1024;
export const VIRTUAL_CANVAS_HEIGHT: number = 1024;

// Controls the background image size. Common values: 'cover', 'contain', '100% 100%'
export const BACKGROUND_SIZE: string = 'contain';

// Central tower's coordinates (for reference, not used directly in this setup)
export const CENTER: IslandPosition = { x: 512, y: 512 };

// Configuration for the header logo
export const HEADER_LOGO_CONFIG: HeaderLogoConfig = {
  url: 'https://big5hk.vercel.app/images/logo.png', // A simple, white abstract logo
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
    undevelopedImg: 'https://big5hk.vercel.app/images/Land01_empty.png',
    activeImg: 'https://big5hk.vercel.app/images/Land01_active.gif',
    developedImg: 'https://big5hk.vercel.app/images/Land01_developed.png',
    cardImg: 'https://big5hk.vercel.app/images/Card01.png', // 01
    promptQuestion: 'What percentage of outpatient visits are paid out-of-pocket?'
  },
  { 
    x: 740, y: 275, size: 360,
    name: 'Outpatient Expansion',
    description: 'Invest in expanding our owned outpatient capacity, capturing broader footprint and enlarged clinics with a customer-centric design.',
    lore: 'Invest in expanding our owned outpatient capacity, capturing broader footprint and enlarged clinics with a customer-centric design.',
    undevelopedImg: 'https://big5hk.vercel.app/images/Land02_empty.png',
    activeImg: 'https://big5hk.vercel.app/images/Land02_active.gif',
    developedImg: 'https://big5hk.vercel.app/images/Land02_developed.png',
    cardImg: 'https://big5hk.vercel.app/images/Card02.png', // 02
    promptQuestion: 'How many clinics will we have under Big 5?'
  },
   { 
    x: 240, y: 330, size: 320,
    name: 'Outpatient M&A',
    description: 'Pursue inorganic opportunities to more than double our market share to 20%',
    lore: 'Pursue inorganic opportunities to more than double our market share to 20%',
    undevelopedImg: 'https://big5hk.vercel.app/images/Land03_empty.png',
    activeImg: 'https://big5hk.vercel.app/images/Land03_active.gif',
    developedImg: 'https://big5hk.vercel.app/images/Land03_developed.png',
    cardImg: 'https://big5hk.vercel.app/images/Card03.png', // 03
    promptQuestion: 'What is the combined market share of the top five HS players?'
  },
  { 
    x: 500, y: 820, size: 340,
    name: 'Hospital Strategy',
    description: 'Develop steerage for inpatient management.',
    lore: 'Develop steerage for inpatient management.',
    undevelopedImg: 'https://big5hk.vercel.app/images/Land04_empty.png',
    activeImg: 'https://big5hk.vercel.app/images/Land04_active.gif',
    developedImg: 'https://big5hk.vercel.app/images/Land04_developed.png',
    cardImg: 'https://big5hk.vercel.app/images/Card04.png', // 04
    promptQuestion: 'Who has the greatest influence on hospital choice?'
  },
  {
    x: 260, y: 700, size: 320,
    name: 'Digital Healthcare Journey',
    description: 'Experience a tailored healthcare journey with a Personalised Health Plan on Blua. Comprehensive support and access to a wide range of services designed for each customer’s unique needs.',
    lore: 'Experience a tailored healthcare journey with a Personalised Health Plan on Blua. Comprehensive support and access to a wide of services designed for each customer’s unique needs.',
    undevelopedImg: 'https://big5hk.vercel.app/images/Land05_empty.png',
    activeImg: 'https://big5hk.vercel.app/images/Land05_active.gif',
    developedImg: 'https://big5hk.vercel.app/images/Land05_developed.png',
    cardImg: 'https://big5hk.vercel.app/images/Card05.png', // 05
    promptQuestion: 'What is our data density percentage to date?'
  },
    { 
    x: 720, y: 720, size: 320,
    name: '4X Profit',
    description: 'Drive operational excellence and innovative service delivery to achieve a fourfold increase in profitability, while aiming to acquire and engage 100 million customers to solidify our leadership position in the healthcare sector.',
    lore: 'Drive operational excellence and innovative service delivery to achieve a fourfold increase in profitability, while aiming to acquire and engage 100 million customers to solidify our leadership position in the healthcare sector.',
    undevelopedImg: 'https://big5hk.vercel.app/images/Land06_empty.png',
    activeImg: 'https://big5hk.vercel.app/images/Land06_active.gif',
    developedImg: 'https://big5hk.vercel.app/images/Land06_developed.png',
    cardImg: 'https://big5hk.vercel.app/images/Card06.png', // 06
    promptQuestion: 'What is our profit ambition?'
  },

];

// Optional list of MP4 links for each island
// Using short, generic videos for demonstration
export const VIDEOS: string[] = [
  "https://big5hk.vercel.app/videos/01island.mp4",
  "https://big5hk.vercel.app/videos/02island.mp4",
  "https://big5hk.vercel.app/videos/03island.mp4",
  "https://big5hk.vercel.app/videos/04island.mp4",
  "https://big5hk.vercel.app/videos/05island.mp4",
  "https://big5hk.vercel.app/videos/06island.mp4",
];

// URL for the introductory MP4 video
export const INTRO_VIDEO_URL: string = "https://big5hk.vercel.app/videos/intro.mp4";

// URL for the second introductory MP4 video. Using outro as placeholder.
export const SECOND_INTRO_VIDEO_URL: string = "https://big5hk.vercel.app/videos/intro2.mp4";

// URL for the celebratory outro video on the completion screen
export const OUTRO_VIDEO_URL: string = "https://big5hk.vercel.app/videos/ending.mp4";

// Configuration for the "Do you know?" prompt in the video modal
export const VIDEO_MODAL_PROMPT_CONFIG = {
  title: "Do you know?",
  buttonText: "Let's find out"
};

// Controls intro video sound. Set to `false` for sound, `true` for muted. A user action is required for unmuted playback.
export const INTRO_VIDEO_MUTED: boolean = false;

// Controls second intro video sound. Set to `false` for sound as requested.
export const SECOND_INTRO_VIDEO_MUTED: boolean = false;

// Controls intro video autoplay. Set to false to wait for a user action.
export const INTRO_VIDEO_AUTOPLAY: boolean = false;

// Configuration for the footer image
export const FOOTER_IMAGE_CONFIG: FooterImageConfig = {
  url: 'https://big5hk.vercel.app/images/footer.png',
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