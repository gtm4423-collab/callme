import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, MessageSquarePlus, X } from 'lucide-react';
import { ReviewItem } from '../types';
import { INITIAL_REVIEWS } from '../data/mockData';

interface ReviewsSectionProps {
  creatorName: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ creatorName }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredReviews = filterRating === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === filterRating);

  const handleLike = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newName.trim() || 'Anonymous Fan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      likes: 1,
      isVerifiedFan: true
    };

    setReviews([newRev, ...reviews]);
    setNewComment('');
    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="pt-6 pb-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Fan Feedback & Reviews</span>
            <span className="text-xs font-normal text-slate-400">({reviews.length + 1839})</span>
          </h3>
          <p className="text-xs text-slate-400">Verified 1-on-1 calls and room experiences</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all flex items-center gap-1.5"
        >
          <MessageSquarePlus size={14} />
          <span>Add Review</span>
        </button>
      </div>

      {/* Rating Summary Bar */}
      <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight">4.9</div>
          <div>
            <div className="flex items-center text-amber-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-slate-400">98% positive satisfaction rate</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              filterRating === 'all' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterRating(5)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              filterRating === 5 ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            5★ Only
          </button>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        {filteredReviews.map((rev) => (
          <div 
            key={rev.id} 
            className="p-3.5 bg-slate-900/60 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white">
                  {rev.author[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">{rev.author}</span>
                    {rev.isVerifiedFan && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle size={10} /> Verified Call
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={10} className="fill-amber-400" />
                      ))}
                    </div>
                    <span>·</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLike(rev.id)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-pink-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
              >
                <ThumbsUp size={12} />
                <span>{rev.likes}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-[#15102a] border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold mb-1">Write a Review for {creatorName}</h3>
            <p className="text-xs text-slate-400 mb-4">Share your feedback about the call experience</p>

            <form onSubmit={handleAddReview} className="space-y-3.5">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star 
                        size={24} 
                        className={star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Your Name or Alias</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Liam R."
                  className="w-full bg-slate-950 border border-purple-900/60 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Your Feedback</label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How was your video or audio call with Sofia?"
                  required
                  className="w-full bg-slate-950 border border-purple-900/60 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-xs font-bold text-white shadow-lg active:scale-95 transition-all"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
