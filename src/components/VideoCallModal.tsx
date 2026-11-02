import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, Heart, 
  Maximize2, Minimize2, Sparkles, SwitchCamera,
  MessageSquare
} from 'lucide-react';
import { CreatorProfile } from '../types';
import { sounds } from '../utils/soundEffects';

interface VideoCallModalProps {
  creator: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  creator,
  isOpen,
  onClose
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected'>('connecting');
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState<boolean>(false);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showInCallChat, setShowInCallChat] = useState<boolean>(false);
  const [inCallMessages, setInCallMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: creator.name, text: "Hey! Can you hear me well? 😊" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Initialize call sound & timer
  useEffect(() => {
    if (!isOpen) {
      if (userStream) {
        userStream.getTracks().forEach(track => track.stop());
        setUserStream(null);
      }
      setCallStatus('connecting');
      setDuration(0);
      return;
    }

    sounds.playConnectedSound();
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 1500);

    // Try camera access for realistic user PIP
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setUserStream(stream);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        // Fallback gracefully without camera permission
      });

    return () => {
      clearTimeout(connectTimer);
    };
  }, [isOpen]);

  // Handle call timer
  useEffect(() => {
    if (!isOpen || callStatus !== 'connected') return;

    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, callStatus]);

  // Keep user video ref attached when stream changes
  useEffect(() => {
    if (userVideoRef.current && userStream) {
      userVideoRef.current.srcObject = userStream;
    }
  }, [userStream]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    sounds.playEndCallSound();
    if (userStream) {
      userStream.getTracks().forEach(track => track.stop());
      setUserStream(null);
    }
    onClose();
  };

  const spawnHeart = () => {
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    setHearts(prev => [...prev, { id, left }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 1800);
  };

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSendInCallMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    setInCallMessages(prev => [...prev, { sender: 'You', text: msg }]);

    setTimeout(() => {
      setInCallMessages(prev => [
        ...prev, 
        { sender: creator.name, text: "You're so sweet! Loving our talk 💕" }
      ]);
      spawnHeart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
      <div 
        ref={modalContainerRef}
        className="relative w-full max-w-md h-[92vh] max-h-[820px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-pink-500/30 flex flex-col justify-between"
      >
        {/* Creator Video Canvas / Background Feed */}
        <div className="absolute inset-0 z-0">
          <img 
            src={creator.avatarUrl} 
            alt={creator.name}
            className="w-full h-full object-cover scale-105 filter brightness-95 animate-[pulse_8s_ease-in-out_infinite]"
          />
          {/* Subtle live cam vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

          {/* Floating animated hearts */}
          {hearts.map(h => (
            <div 
              key={h.id}
              className="absolute bottom-24 text-3xl animate-[bounce_1.8s_ease-out] transition-all opacity-90 pointer-events-none drop-shadow-lg"
              style={{ left: `${h.left}%` }}
            >
              💖
            </div>
          ))}
        </div>

        {/* Top Bar Info & Controls */}
        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                {creator.name}
                <span className="text-[10px] bg-pink-500/80 px-1 rounded text-white font-normal">HD LIVE</span>
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                {callStatus === 'connecting' ? 'Connecting...' : formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleFullscreen}
              className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button 
              onClick={() => setShowInCallChat(!showInCallChat)}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center border border-white/10 transition-colors ${
                showInCallChat ? 'bg-pink-600 text-white' : 'bg-black/50 text-white/80 hover:text-white'
              }`}
              title="In-call chat"
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </div>

        {/* User Self Video PiP (Picture in Picture) */}
        <div className="absolute top-18 right-4 z-20 w-28 h-38 sm:w-32 sm:h-44 bg-slate-900/90 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl backdrop-blur-md">
          {userStream && !isVideoDisabled ? (
            <video 
              ref={userVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-2 text-center">
              <VideoOff size={20} className="mb-1 text-slate-500" />
              <span className="text-[10px]">Camera off</span>
            </div>
          )}
          <div className="absolute bottom-1.5 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white">
            You
          </div>
        </div>

        {/* In-Call Live Chat Drawer */}
        {showInCallChat && (
          <div className="relative z-20 mx-4 max-h-48 overflow-y-auto space-y-2 bg-black/65 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            {inCallMessages.map((m, idx) => (
              <div key={idx} className={`text-xs ${m.sender === 'You' ? 'text-right' : 'text-left'}`}>
                <span className={`font-semibold ${m.sender === 'You' ? 'text-pink-400' : 'text-emerald-400'}`}>
                  {m.sender}:
                </span>{' '}
                <span className="text-white/90">{m.text}</span>
              </div>
            ))}
            <form onSubmit={handleSendInCallMessage} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Say something to Sofia..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-white/10 text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:border-pink-500"
              />
              <button 
                type="submit" 
                className="bg-pink-600 hover:bg-pink-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className="relative z-20 p-5 space-y-4">
          {/* Reaction button */}
          <div className="flex items-center justify-end pr-1">
            <button
              onClick={spawnHeart}
              className="w-11 h-11 rounded-full bg-pink-600/90 hover:bg-pink-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              title="Send Love"
            >
              <Heart size={20} className="fill-white" />
            </button>
          </div>

          {/* Primary Action Controls */}
          <div className="bg-slate-900/85 backdrop-blur-xl px-5 py-3.5 rounded-3xl border border-white/10 flex items-center justify-around shadow-2xl">
            {/* Toggle Mic */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-red-500/80 text-white' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Toggle Video */}
            <button
              onClick={() => setIsVideoDisabled(!isVideoDisabled)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isVideoDisabled ? 'bg-red-500/80 text-white' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title={isVideoDisabled ? 'Turn on camera' : 'Turn off camera'}
            >
              {isVideoDisabled ? <VideoOff size={20} /> : <Video size={20} />}
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="w-13 h-13 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 active:scale-90 transition-transform"
              title="End Call"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
