import React from 'react';
import { 
  Video, MessageSquare, Phone, ChevronDown, Check, Star, 
  Eye, Sparkles, ArrowRight, Share2, Heart, ExternalLink, Flame
} from 'lucide-react';
import { CreatorProfile, ActionButton } from '../types';
import { trackClickEvent } from '../utils/supabase';

interface CreatorCardProps {
  creator: CreatorProfile;
  onActionButtonClick: (button: ActionButton) => void;
  onOpenGallery: () => void;
  onScrollToDetails: () => void;
  onShare: () => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  onActionButtonClick,
  onOpenGallery,
  onScrollToDetails,
  onShare
}) => {
  const renderButtonIcon = (iconName: ActionButton['icon']) => {
    switch (iconName) {
      case 'video':
        return <Video className="w-6 h-6 text-white" strokeWidth={2.2} />;
      case 'message':
        return <MessageSquare className="w-6 h-6 text-white" strokeWidth={2.2} />;
      case 'phone':
        return <Phone className="w-6 h-6 text-white" strokeWidth={2.2} />;
      case 'flame':
        return <Flame className="w-6 h-6 text-white" strokeWidth={2.2} />;
      default:
        return <Sparkles className="w-6 h-6 text-white" strokeWidth={2.2} />;
    }
  };

  return (
    <div className="relative w-full text-white select-none">
      
      {/* Top Ambient Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-purple-600/20 via-pink-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Utilities (Share Button) */}
      <div className="relative z-10 flex items-center justify-end px-2 pt-2 mb-2">
        <button
          onClick={onShare}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="Share profile"
        >
          <Share2 size={14} />
        </button>
      </div>

      {/* Avatar Container with glowing rings and badges matching screenshot */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-4">
        
        {/* Floating "Online" Pill at top */}
        <div className="z-20 -mb-3 bg-[#0d091a]/90 backdrop-blur-md px-3.5 py-0.5 rounded-full border border-purple-500/30 text-[11px] font-medium text-emerald-400 shadow-md">
          Online
        </div>

        {/* Avatar Ring */}
        <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-[#ff2a85] via-[#a855f7] to-[#ec4899] glow-ring shadow-2xl">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-slate-900 border-2 border-[#120c24]">
            <img 
              src={creator.avatarUrl} 
              alt={creator.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to screenshot if needed
                (e.target as HTMLImageElement).src = '/public/assets/aistudio/Screenshot_2026-10-30_220647_4a21bc9a.png';
              }}
            />
          </div>
        </div>

        {/* Floating "LIVE NOW" Pill at bottom */}
        <div className="z-20 -mt-3.5 bg-[#00df81] text-[#052b1a] px-3.5 py-1 rounded-full text-xs font-black tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-[#052b1a] animate-pulse" />
          <span>LIVE NOW</span>
        </div>
      </div>

      {/* Name, Verified Badge & Age */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {creator.name}
        </h1>

        {creator.verified && (
          <div className="w-5 h-5 rounded-full bg-[#e8198b] flex items-center justify-center text-white shadow-md shadow-pink-500/40">
            <Check size={13} strokeWidth={3} />
          </div>
        )}

        <div className="px-2 py-0.5 bg-[#19122c] border border-white/10 rounded-md text-xs font-semibold text-slate-300">
          {creator.age}
        </div>
      </div>

      {/* Social Proof (Stars, Reviews & Views) */}
      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-300">
        <div className="flex items-center gap-1 font-semibold text-amber-400">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span>{creator.rating}</span>
          <span className="text-slate-400 font-normal">({(creator.reviewsCount / 1000).toFixed(1)}k reviews)</span>
        </div>

        <span className="text-slate-600">·</span>

        <div className="flex items-center gap-1 text-pink-400 font-medium">
          <Eye size={14} />
          <span className="text-slate-300">{creator.viewsCount} views</span>
        </div>
      </div>

      {/* Creator Status Quote Box */}
      <div className="mt-4 px-1">
        <div className="bg-[#15102a]/90 backdrop-blur-md border border-purple-500/20 rounded-2xl p-3 text-center shadow-lg">
          <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
            <span className="mr-1 text-sm">💬</span>
            "{creator.statusQuote}"
          </p>
        </div>
      </div>

      {/* 3 Main Action Buttons with direct links */}
      <div className="mt-5 space-y-3 px-1">
        {creator.buttons.map((btn) => {
          const content = (
            <>
              {/* Shimmer light effect across button */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {/* Left Icon with frosted glass container */}
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                {renderButtonIcon(btn.icon)}
              </div>

              {/* Middle Text Info */}
              <div className="flex-1 text-left px-3.5">
                <div className="font-extrabold text-sm sm:text-base tracking-wide uppercase leading-tight drop-shadow-sm">
                  {btn.title}
                </div>
                <div className="text-[11px] sm:text-xs text-white/90 font-medium mt-0.5">
                  {btn.subtitle}
                </div>
              </div>

              {/* Right Arrow Button Badge */}
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20 group-hover:bg-white/30 group-hover:translate-x-0.5 transition-all">
                <ArrowRight size={16} strokeWidth={2.5} />
              </div>
            </>
          );

          if (btn.url) {
            return (
              <a
                key={btn.id}
                href={btn.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClickEvent(btn.title, btn.url || '')}
                className={`w-full group relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-r ${btn.gradient} text-white shadow-xl transition-all duration-200 active:scale-[0.98] hover:brightness-110 flex items-center justify-between cursor-pointer no-underline`}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={btn.id}
              onClick={() => {
                trackClickEvent(btn.title, 'internal_action');
                onActionButtonClick(btn);
              }}
              className={`w-full group relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-r ${btn.gradient} text-white shadow-xl transition-all duration-200 active:scale-[0.98] hover:brightness-110 flex items-center justify-between cursor-pointer`}
            >
              {content}
            </button>
          );
        })}
      </div>

      {/* Down Chevron / Scroll to More Content */}
      <div className="flex flex-col items-center justify-center pt-5 pb-1">
        <button
          onClick={onScrollToDetails}
          className="w-10 h-10 rounded-full bg-[#1b1433] border border-purple-500/30 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-900/40 transition-all active:scale-90 shadow-lg shadow-purple-900/20"
          title="Explore photos, bio & reviews"
        >
          <ChevronDown size={22} className="animate-bounce" />
        </button>
        <span className="text-[10px] text-slate-400 mt-1">Scroll for reviews & vault</span>
      </div>

    </div>
  );
};
