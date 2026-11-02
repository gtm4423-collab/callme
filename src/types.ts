export interface ActionButton {
  id: string;
  title: string;
  subtitle: string;
  icon: 'video' | 'message' | 'phone';
  gradient: string;
  actionType: 'video-call' | 'room-chat' | 'audio-call' | 'link';
  url?: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  age: number;
  verified: boolean;
  avatarUrl: string;
  isLive: boolean;
  isOnline: boolean;
  rating: number;
  reviewsCount: number;
  viewsCount: string;
  statusQuote: string;
  bio: string;
  languages: string[];
  location: string;
  buttons: ActionButton[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'creator';
  text: string;
  timestamp: string;
  mediaUrl?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
  isVerifiedFan: boolean;
}
