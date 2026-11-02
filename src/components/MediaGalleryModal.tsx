import React, { useState } from 'react';
import { X, Lock, Eye, Heart, Sparkles, Check } from 'lucide-react';
import { CreatorProfile } from '../types';
import { GALLERY_ITEMS } from '../data/mockData';

interface MediaGalleryModalProps {
  creator: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const MediaGalleryModal: React.FC<MediaGalleryModalProps> = ({
  creator,
  isOpen,
  onClose
}) => {
  const [activeItem, setActiveItem] = useState<typeof GALLERY_ITEMS[0] | null>(null);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [likes, setLikes] = useState<{ [id: string]: number }>({
    'gal-1': 340,
    'gal-2': 890,
    'gal-3': 1250,
    'gal-4': 560
  });

  if (!isOpen) return null;

  const handleUnlock = (id: string) => {
    setUnlockedItems(prev => [...prev, id]);
  };

  const handleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4">
      <div className="relative w-full max-w-md h-[88vh] max-h-[750px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-pink-500/30 flex flex-col justify-between">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{creator.name}’s Media Vault</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full">VIP Clips</span>
            </h3>
            <p className="text-xs text-slate-400">Exclusive backstage photos and short clips</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3.5">
          {GALLERY_ITEMS.map((item) => {
            const isUnlocked = !item.isVip || unlockedItems.includes(item.id);

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 aspect-[4/5] flex flex-col justify-end"
              >
                {/* Media Image */}
                <img
                  src={creator.avatarUrl}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    !isUnlocked ? 'filter blur-md brightness-50' : 'brightness-95'
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Locked VIP state overlay */}
                {!isUnlocked ? (
                  <div className="relative z-10 p-3 text-center flex flex-col items-center my-auto">
                    <div className="w-9 h-9 rounded-full bg-pink-500/30 border border-pink-500 flex items-center justify-center text-pink-300 mb-2">
                      <Lock size={16} />
                    </div>
                    <span className="text-xs font-bold text-white mb-1">VIP Exclusive</span>
                    <button
                      onClick={() => handleUnlock(item.id)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md active:scale-95 transition-transform"
                    >
                      Tap to Unlock Free
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10 p-3 space-y-1">
                    <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {item.views}
                      </span>
                      <button
                        onClick={() => handleLike(item.id)}
                        className="flex items-center gap-1 hover:text-pink-400 transition-colors"
                      >
                        <Heart size={11} className="fill-pink-500 text-pink-500" />
                        <span>{likes[item.id]}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-900 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-400">Exclusive Sofia Media Feed</span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Updated Daily</span>
          </span>
        </div>

      </div>
    </div>
  );
};
