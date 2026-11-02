import React, { useState, useRef } from 'react';
import { 
  Smartphone, Monitor, Share2, Sparkles, 
  Check, Copy, QrCode, Lock
} from 'lucide-react';
import { CreatorProfile, ActionButton } from './types';
import { DEFAULT_PROFILES } from './data/mockData';
import { CreatorCard } from './components/CreatorCard';
import { VideoCallModal } from './components/VideoCallModal';
import { AudioCallModal } from './components/AudioCallModal';
import { ChatRoomModal } from './components/ChatRoomModal';
import { MediaGalleryModal } from './components/MediaGalleryModal';
import { ReviewsSection } from './components/ReviewsSection';

export default function App() {
  // Always use the latest profile configured with CPA links
  const [profile] = useState<CreatorProfile>(DEFAULT_PROFILES[0]);
  const [deviceMode, setDeviceMode] = useState<'phone' | 'wide'>('phone');
  
  // Modals state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const detailsRef = useRef<HTMLDivElement>(null);

  // Fallback Action Button Handler if opened as internal action
  const handleActionButtonClick = (button: ActionButton) => {
    if (button.url) {
      window.location.href = button.url;
      return;
    }
    if (button.actionType === 'video-call') {
      setIsVideoModalOpen(true);
    } else if (button.actionType === 'room-chat') {
      setIsChatModalOpen(true);
    } else if (button.actionType === 'audio-call') {
      setIsAudioModalOpen(true);
    }
  };

  const handleScrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07050e] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0d091b]/90 backdrop-blur-xl border-b border-purple-900/30 px-4 py-2.5 flex items-center justify-between">
        
        {/* Brand / Title - Sofia Live */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-pink-500/30">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Sofia Live</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30 font-medium">
                Online
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Official 1-on-1 private video & audio link</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Device View Toggle (desktop only) */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setDeviceMode('phone')}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                deviceMode === 'phone' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Mockup View"
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setDeviceMode('wide')}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                deviceMode === 'wide' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Responsive Wide View"
            >
              <Monitor size={14} />
              <span>Wide</span>
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Share page"
          >
            <Share2 size={15} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-start justify-center p-2 sm:p-6 lg:p-8">
        
        {/* Phone Frame or Centered Container */}
        <div 
          className={`w-full transition-all duration-300 ${
            deviceMode === 'phone' 
              ? 'max-w-[420px]' 
              : 'max-w-4xl'
          }`}
        >
          {/* Mockup Card */}
          <div className={`relative bg-gradient-to-b from-[#110c22] via-[#0d091b] to-[#07050e] rounded-[36px] overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-950/40 ${
            deviceMode === 'phone' ? 'p-4 sm:p-5' : 'p-6 sm:p-8'
          }`}>
            
            {/* Phone Speaker Notch bar (in phone mode) */}
            {deviceMode === 'phone' && (
              <div className="w-28 h-4 bg-black/40 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>
            )}

            {/* Layout when in Wide mode vs Phone mode */}
            {deviceMode === 'wide' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Creator Card matching exact screenshot */}
                <div className="lg:col-span-6 bg-[#130e26] p-5 rounded-3xl border border-purple-500/20">
                  <CreatorCard 
                    creator={profile}
                    onActionButtonClick={handleActionButtonClick}
                    onOpenGallery={() => setIsGalleryModalOpen(true)}
                    onScrollToDetails={handleScrollToDetails}
                    onShare={() => setIsShareModalOpen(true)}
                  />
                </div>

                {/* Right Column: Bio, Media Vault & Reviews */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Bio Card */}
                  <div className="bg-[#130e26] p-5 rounded-3xl border border-purple-500/20 space-y-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles size={16} className="text-pink-400" />
                      <span>About Sofia</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {profile.bio}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                        📍 {profile.location}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                        🗣️ {profile.languages.join(', ')}
                      </span>
                    </div>

                    {/* Gallery quick link */}
                    <div className="pt-2">
                      <button 
                        onClick={() => setIsGalleryModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-xs font-semibold text-pink-300 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Lock size={13} />
                        <span>View Sofia's VIP Photo Vault</span>
                      </button>
                    </div>
                  </div>

                  {/* Reviews on wide view */}
                  <div className="bg-[#130e26] p-5 rounded-3xl border border-purple-500/20">
                    <ReviewsSection creatorName={profile.name} />
                  </div>
                </div>
              </div>
            ) : (
              /* Phone View: Exact matching mobile card */
              <div className="space-y-6">
                <CreatorCard 
                  creator={profile}
                  onActionButtonClick={handleActionButtonClick}
                  onOpenGallery={() => setIsGalleryModalOpen(true)}
                  onScrollToDetails={handleScrollToDetails}
                  onShare={() => setIsShareModalOpen(true)}
                />

                {/* Below Fold Section */}
                <div ref={detailsRef} className="pt-4 border-t border-purple-900/30 space-y-5">
                  {/* Bio Card */}
                  <div className="bg-[#15102a]/80 p-4 rounded-2xl border border-purple-500/20 space-y-2.5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles size={14} className="text-pink-400" />
                      <span>About Sofia</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {profile.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-300">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                        📍 {profile.location}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                        🗣️ {profile.languages.join(', ')}
                      </span>
                    </div>

                    <button 
                      onClick={() => setIsGalleryModalOpen(true)}
                      className="w-full mt-2 py-2 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-xs font-semibold text-pink-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Lock size={13} />
                      <span>Unlock VIP Photo Vault ({profile.viewsCount} views)</span>
                    </button>
                  </div>

                  {/* Verified Fan Reviews */}
                  <ReviewsSection creatorName={profile.name} />
                </div>
              </div>
            )}

            {/* Subtle Footer branding */}
            <div className="mt-8 pt-4 border-t border-white/5 text-center text-[11px] text-slate-500">
              © {new Date().getFullYear()} Sofia Live Biolink · Secure 1-on-1 Connect
            </div>

          </div>
        </div>
      </main>

      {/* Interactive Modals */}
      <VideoCallModal 
        creator={profile}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      <AudioCallModal 
        creator={profile}
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />

      <ChatRoomModal 
        creator={profile}
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onStartVideoCall={() => {
          setIsChatModalOpen(false);
          setIsVideoModalOpen(true);
        }}
        onStartAudioCall={() => {
          setIsChatModalOpen(false);
          setIsAudioModalOpen(true);
        }}
      />

      <MediaGalleryModal 
        creator={profile}
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
      />

      {/* Share Profile Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-[#130f24] border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <h3 className="text-base font-bold mb-1">Share Sofia's Profile</h3>
            <p className="text-xs text-slate-400 mb-4">Direct link to private video call & chat</p>

            <div className="bg-slate-950 p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-2 mb-4">
              <span className="text-xs text-slate-300 truncate font-mono">
                {window.location.href}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex justify-center p-4 bg-white rounded-2xl mb-4">
              <div className="flex flex-col items-center justify-center text-slate-900">
                <QrCode size={110} />
                <span className="text-[10px] text-slate-600 mt-1 font-mono">Scan to open on mobile</span>
              </div>
            </div>

            <button
              onClick={() => setIsShareModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
