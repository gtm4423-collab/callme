import { CreatorProfile, ReviewItem } from '../types';

export const DEFAULT_PROFILES: CreatorProfile[] = [
  {
    id: 'sofia-1',
    name: 'Sofia',
    age: 22,
    verified: true,
    avatarUrl: '/src/assets/images/sofia_avatar_1793376541010.jpg',
    isLive: true,
    isOnline: true,
    rating: 4.9,
    reviewsCount: 1842,
    viewsCount: '2.4k',
    statusQuote: 'Available for private video calls & chat right now! Let’s talk 🔥',
    bio: 'Hey there! ✨ Content creator, model & dancer. I love deep 1-on-1 conversations, late night calls and sharing exclusive moments with my fans!',
    languages: ['English', 'Spanish', 'Italian'],
    location: 'Miami, Florida',
    buttons: [
      {
        id: 'btn-video',
        title: 'JOIN FREE CALL',
        subtitle: 'Start Live Private Cam Stream',
        icon: 'video',
        gradient: 'from-[#ff1361] via-[#f72585] to-[#b5179e]',
        actionType: 'link',
        url: 'https://tr.cpadollar.com/redirect?aff_id=2082&offer_id=94'
      },
      {
        id: 'btn-chat',
        title: 'ROOM CHAT',
        subtitle: 'Private Instant Messaging',
        icon: 'message',
        gradient: 'from-[#8a2be2] via-[#7209b7] to-[#4361ee]',
        actionType: 'link',
        url: 'https://tr.cpadollar.com/redirect?aff_id=2082&offer_id=97'
      },
      {
        id: 'btn-phone',
        title: 'FREE CALL',
        subtitle: '1-on-1 Direct Audio Connection',
        icon: 'phone',
        gradient: 'from-[#00f59b] via-[#00c853] to-[#009688]',
        actionType: 'link',
        url: 'https://auctionr.org/4/6aa43a312f95a6b31bfcb5dc6e435ceb'
      },
      {
        id: 'btn-vip',
        title: 'VIP PRIVATE SHOW',
        subtitle: 'Access Sofia’s Live Cam Feed 🔥',
        icon: 'flame',
        gradient: 'from-[#ff6b00] via-[#ff0055] to-[#7928ca]',
        actionType: 'link',
        url: 'https://cpajunkie.trcpa.link/click?camp=2399&pubid=9346'
      }
    ]
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Alex M.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    rating: 5,
    date: '2 hours ago',
    comment: 'Sofia is literally the sweetest and most genuine person ever! The private video call was crystal clear and super fun. 10/10 recommend! 🔥',
    likes: 42,
    isVerifiedFan: true
  },
  {
    id: 'rev-2',
    author: 'David K.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    rating: 5,
    date: 'Yesterday',
    comment: 'Instant pickup on the room chat and audio call! Her voice is so relaxing and charming. Worth every minute.',
    likes: 29,
    isVerifiedFan: true
  },
  {
    id: 'rev-3',
    author: 'Michael T.',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    rating: 5,
    date: '3 days ago',
    comment: 'Love her vibe and energy! She answered all my questions and gave great conversation. Best creator on this platform hands down.',
    likes: 18,
    isVerifiedFan: true
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'Sunday Morning Coffee ☕',
    views: '1.2k',
    likes: 340,
    isVip: false
  },
  {
    id: 'gal-2',
    title: 'Sunset Beach Walk 🌊',
    views: '2.8k',
    likes: 890,
    isVip: false
  },
  {
    id: 'gal-3',
    title: 'Private Studio Session ✨',
    views: '4.1k',
    likes: 1250,
    isVip: true
  },
  {
    id: 'gal-4',
    title: 'Late Night Q&A Clip 🌙',
    views: '1.9k',
    likes: 560,
    isVip: true
  }
];
