import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Heart, Sparkles } from 'lucide-react';
import { CreatorProfile } from '../types';
import { sounds } from '../utils/soundEffects';

interface AudioCallModalProps {
  creator: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const AudioCallModal: React.FC<AudioCallModalProps> = ({
  creator,
  isOpen,
  onClose
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);

  useEffect(() => {
    if (!isOpen) {
      sounds.stopRingtone();
      setCallStatus('ringing');
      setDuration(0);
      return;
    }

    // Start synthetic ringtone
    sounds.startRingtone();

    // Answer call after 2.5 seconds
    const answerTimeout = setTimeout(() => {
      sounds.stopRingtone();
      sounds.playConnectedSound();
      setCallStatus('connected');
    }, 2500);

    return () => {
      clearTimeout(answerTimeout);
      sounds.stopRingtone();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || callStatus !== 'connected') return;

    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, callStatus]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    sounds.stopRingtone();
    sounds.playEndCallSound();
    onClose();
  };

  const spawnHeart = () => {
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 60) + 20;
    setHearts(prev => [...prev, { id, left }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-sm h-[680px] bg-gradient-to-b from-[#19102c] via-[#0f0c1b] to-[#080511] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 flex flex-col justify-between p-6">
        
        {/* Floating Heart Animations */}
        {hearts.map(h => (
          <div 
            key={h.id}
            className="absolute bottom-28 text-3xl animate-[bounce_1.5s_ease-out] transition-all opacity-90 pointer-events-none drop-shadow-lg"
            style={{ left: `${h.left}%` }}
          >
            💚
          </div>
        ))}

        {/* Top Info */}
        <div className="text-center pt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {callStatus === 'ringing' ? 'Calling Sofia...' : 'HD Audio Encrypted Call'}
          </div>

          <h2 className="text-2xl font-bold text-white tracking-wide">{creator.name}</h2>
          <p className="text-sm text-slate-400 mt-1">
            {callStatus === 'ringing' ? 'Ringing...' : formatTime(duration)}
          </p>
        </div>

        {/* Center Glowing Avatar & Waveform */}
        <div className="flex flex-col items-center justify-center my-auto">
          <div className="relative">
            {/* Multiple pulsing rings when connected */}
            <div className={`absolute -inset-4 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 blur-xl ${callStatus === 'connected' ? 'animate-pulse' : ''}`} />
            <div className={`absolute -inset-8 rounded-full border border-emerald-500/20 ${callStatus === 'connected' ? 'animate-ping duration-1000' : ''}`} />
            
            <div className="relative w-40 h-40 rounded-full p-1.5 bg-gradient-to-tr from-emerald-400 via-teal-400 to-emerald-600 shadow-xl shadow-emerald-500/20">
              <img 
                src={creator.avatarUrl} 
                alt={creator.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Dancing Audio Waveform */}
          <div className="flex items-center gap-1.5 mt-8 h-8">
            {[40, 75, 90, 50, 95, 60, 85, 45, 90, 70, 40].map((height, i) => (
              <div 
                key={i}
                className={`w-1.5 bg-emerald-400 rounded-full transition-all duration-300 ${
                  callStatus === 'connected' ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{ 
                  height: callStatus === 'connected' ? `${height}%` : '20%',
                  animationDelay: `${i * 120}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions & Controls */}
        <div className="space-y-6 pb-4">
          {/* Reaction button */}
          <div className="flex items-center justify-center">
            <button
              onClick={spawnHeart}
              className="w-11 h-11 rounded-full bg-slate-800/80 hover:bg-slate-700 text-emerald-400 flex items-center justify-center border border-emerald-500/20 active:scale-95 transition-transform"
              title="Send Heart"
            >
              <Heart size={20} className="fill-emerald-400" />
            </button>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-around px-2">
            {/* Mute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-13 h-13 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-red-500/80 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 active:scale-90 transition-transform"
              title="Hang Up"
            >
              <PhoneOff size={28} />
            </button>

            {/* Speakerphone */}
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-13 h-13 rounded-full flex items-center justify-center transition-all ${
                isSpeakerOn ? 'bg-emerald-600/80 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
            >
              {isSpeakerOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
