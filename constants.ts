import { Service } from './types';

export const APP_NAME = "Grokhali SMM";
export const SUPPORT_PHONE = "9769004746";
export const OWNER_NAME = "Roshan Khanal";

export const MOCK_SERVICES: Service[] = [
  // --- YOUTUBE CHEAPEST / PROMOTIONAL ---
  {
    id: '300',
    category: 'YouTube [Cheapest]',
    name: 'YouTube Views - [Cheapest Server] [Slow Start] - Rs. 85/1K',
    rate: 85.00,
    min: 500,
    max: 100000,
    description: 'Cheapest views in the market. Good for boosting count. No retention guarantee.'
  },
  {
    id: '300b',
    category: 'YouTube [Cheapest]',
    name: 'YouTube Subscribers - [Bot/Low Quality] [No Refill] - Rs. 850/1K',
    rate: 850.00,
    min: 100,
    max: 2000,
    description: 'Good for reaching numbers only. These may drop. No refund/refill.'
  },

  // --- INSTAGRAM SERVICES ---
  {
    id: '100',
    category: 'Instagram Followers [Guaranteed]',
    name: 'Instagram Followers - [Cheapest] [No Refill] - Rs. 30/1K',
    rate: 30.00,
    min: 50,
    max: 10000,
    description: 'Cheapest in the world. Mixed quality. No refill if they drop.'
  },
  {
    id: '101',
    category: 'Instagram Followers [Guaranteed]',
    name: 'Instagram Followers - [Global] [30 Days Refill] - Rs. 65/1K',
    rate: 65.00,
    min: 10,
    max: 100000,
    description: 'High quality real looking global profiles. 30 days refill guarantee.'
  },
  {
    id: '102',
    category: 'Instagram Followers [Guaranteed]',
    name: 'Instagram Followers - [USA Premium] [Real Users] - Rs. 850/1K',
    rate: 850.00,
    min: 100,
    max: 20000,
    description: '100% Real active USA users. Best for business accounts targeting US audience.'
  },
  {
    id: '103',
    category: 'Instagram Likes',
    name: 'Instagram Likes - [Cheapest] [Bot] - Rs. 8/1K',
    rate: 8.00,
    min: 50,
    max: 20000,
  },
  {
    id: '103b',
    category: 'Instagram Likes',
    name: 'Instagram Likes - [Global] [Instant] - Rs. 15/1K',
    rate: 15.00,
    min: 10,
    max: 50000,
  },
  {
    id: '104',
    category: 'Instagram Likes',
    name: 'Instagram Likes - [USA] [Real] - Rs. 150/1K',
    rate: 150.00,
    min: 50,
    max: 10000,
    description: 'Likes from real US profiles.'
  },
  {
    id: '105',
    category: 'Instagram Views',
    name: 'Instagram Reel Views - [Fast] - Rs. 2/1K',
    rate: 2.00,
    min: 100,
    max: 10000000,
  },
  {
    id: '106',
    category: 'Instagram Saves',
    name: 'Instagram Post Saves - [Ranking] - Rs. 20/1K',
    rate: 20.00,
    min: 50,
    max: 10000,
    description: 'Helps your post reach the explore page.'
  },

  // --- YOUTUBE PREMIUM SERVICES ---
  {
    id: '301',
    category: 'YouTube Views',
    name: 'YouTube Views - [Global] [Retention: 2-5 min] - Rs. 180/1K',
    rate: 180.00,
    min: 100,
    max: 1000000,
  },
  {
    id: '302',
    category: 'YouTube Views',
    name: 'YouTube Views - [USA] [High Retention] - Rs. 550/1K',
    rate: 550.00,
    min: 500,
    max: 100000,
    description: 'Views from USA IP addresses. Great for CPM.'
  },
  {
    id: '303',
    category: 'YouTube Subscribers',
    name: 'YouTube Subscribers - [Global] [Real] [Lifetime Refill] - Rs. 300/1K',
    rate: 300.00,
    min: 10,
    max: 2000,
  },
  {
    id: '304',
    category: 'YouTube Subscribers',
    name: 'YouTube Subscribers - [USA] [Non-Drop] - Rs. 600/1K',
    rate: 600.00,
    min: 50,
    max: 5000,
    description: 'Real USA based channels. Lifetime Guarantee.'
  },
  {
    id: '305',
    category: 'YouTube Likes/Comments',
    name: 'YouTube Likes - [Instant] - Rs. 60/1K',
    rate: 60.00,
    min: 50,
    max: 10000,
  },

  // --- TIKTOK SERVICES ---
  {
    id: '401',
    category: 'TikTok Services',
    name: 'TikTok Views - [Cheapest] [Instant] - Rs. 5/1K',
    rate: 5.00,
    min: 500,
    max: 10000000,
  },
  {
    id: '402',
    category: 'TikTok Likes',
    name: 'TikTok Likes - [Global] - Rs. 120/1K',
    rate: 120.00,
    min: 50,
    max: 10000,
  },
  {
    id: '403',
    category: 'TikTok Followers',
    name: 'TikTok Followers - [Global] - Rs. 350/1K',
    rate: 350.00,
    min: 100,
    max: 50000,
  },
  {
    id: '404',
    category: 'TikTok Followers',
    name: 'TikTok Followers - [USA] [Active] - Rs. 1200/1K',
    rate: 1200.00,
    min: 100,
    max: 10000,
  },

  // --- TELEGRAM SERVICES ---
  {
    id: '500',
    category: 'Telegram',
    name: 'Telegram Members - [Cheapest] [Silent] - Rs. 50/1K',
    rate: 50.00,
    min: 500,
    max: 20000,
  },
  {
    id: '501',
    category: 'Telegram',
    name: 'Telegram Channel Members - [Global] [Refill] - Rs. 90/1K',
    rate: 90.00,
    min: 100,
    max: 50000,
  },
  {
    id: '502',
    category: 'Telegram',
    name: 'Telegram Channel Members - [USA/EU] [Crypto] - Rs. 400/1K',
    rate: 400.00,
    min: 100,
    max: 20000,
  },
  {
    id: '503',
    category: 'Telegram',
    name: 'Telegram Post Views - [Last 5 Posts] - Rs. 5/1K',
    rate: 5.00,
    min: 100,
    max: 200000,
  },

  // --- FACEBOOK SERVICES ---
  {
    id: '701',
    category: 'Facebook Services',
    name: 'Facebook Page Likes/Followers - [Global] - Rs. 250/1K',
    rate: 250.00,
    min: 100,
    max: 50000,
  },
  {
    id: '702',
    category: 'Facebook Services',
    name: 'Facebook Page Likes - [USA] [Real] - Rs. 1500/1K',
    rate: 1500.00,
    min: 100,
    max: 5000,
  },
  {
    id: '703',
    category: 'Facebook Services',
    name: 'Facebook Video Views - [Monetizable] - Rs. 80/1K',
    rate: 80.00,
    min: 500,
    max: 1000000,
  },

  // --- PINTEREST SERVICES ---
  {
    id: '601',
    category: 'Pinterest',
    name: 'Pinterest Followers - [Global] - Rs. 400/1K',
    rate: 400.00,
    min: 100,
    max: 10000,
  },
  {
    id: '602',
    category: 'Pinterest',
    name: 'Pinterest Repins/Saves - Rs. 300/1K',
    rate: 300.00,
    min: 50,
    max: 5000,
  },

  // --- DISCORD SERVICES ---
  {
    id: '801',
    category: 'Discord Services',
    name: 'Discord Offline Members - [Looks Real] - Rs. 350/1K',
    rate: 350.00,
    min: 100,
    max: 10000,
  },
  {
    id: '802',
    category: 'Discord Services',
    name: 'Discord Online Members - [Active 24/7] - Rs. 1200/1K',
    rate: 1200.00,
    min: 50,
    max: 2000,
  },

  // --- SPOTIFY SERVICES ---
  {
    id: '901',
    category: 'Spotify Services',
    name: 'Spotify Plays - [Global] [Royalty Eligible] - Rs. 80/1K',
    rate: 80.00,
    min: 1000,
    max: 1000000,
  },
  {
    id: '902',
    category: 'Spotify Services',
    name: 'Spotify Plays - [USA] [Premium] - Rs. 250/1K',
    rate: 250.00,
    min: 1000,
    max: 500000,
    description: 'Plays from USA Premium Accounts.'
  },
  {
    id: '903',
    category: 'Spotify Services',
    name: 'Spotify Artist Followers - [Global] - Rs. 180/1K',
    rate: 180.00,
    min: 100,
    max: 50000,
  },

  // --- SOUNDCLOUD SERVICES ---
  {
    id: '1201',
    category: 'SoundCloud Services',
    name: 'SoundCloud Plays - [Global] - Rs. 5/1K',
    rate: 5.00,
    min: 100,
    max: 1000000,
  },
  {
    id: '1202',
    category: 'SoundCloud Services',
    name: 'SoundCloud Likes - [Global] - Rs. 80/1K',
    rate: 80.00,
    min: 50,
    max: 10000,
  },

  // --- TWITTER / X SERVICES ---
  {
    id: '1001',
    category: 'Twitter/X Services',
    name: 'Twitter Followers - [Global] - Rs. 800/1K',
    rate: 800.00,
    min: 100,
    max: 50000,
  },
  {
    id: '1002',
    category: 'Twitter/X Services',
    name: 'Twitter Followers - [USA] [NFT/Crypto] - Rs. 2500/1K',
    rate: 2500.00,
    min: 100,
    max: 5000,
  },

  // --- LINKEDIN SERVICES ---
  {
    id: '1101',
    category: 'LinkedIn Services',
    name: 'LinkedIn Followers - [Global] - Rs. 1500/1K',
    rate: 1500.00,
    min: 50,
    max: 5000,
  },
  {
    id: '1102',
    category: 'LinkedIn Services',
    name: 'LinkedIn Connections - [USA] - Rs. 3000/1K',
    rate: 3000.00,
    min: 50,
    max: 2000,
    description: 'High quality USA connections for professional growth.'
  }
];

export const CATEGORIES = Array.from(new Set(MOCK_SERVICES.map(s => s.category)));