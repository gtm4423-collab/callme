import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Video, Phone, Image as ImageIcon, 
  Smile, CheckCheck, Sparkles, MoreVertical 
} from 'lucide-react';
import { CreatorProfile, ChatMessage } from '../types';
import { sounds } from '../utils/soundEffects';

interface ChatRoomModalProps {
  creator: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
  onStartVideoCall: () => void;
  onStartAudioCall: () => void;
}

export const ChatRoomModal: React.FC<ChatRoomModalProps> = ({
  creator,
  isOpen,
  onClose,
  onStartVideoCall,
  onStartAudioCall
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'creator',
      text: `Hey! Thanks for stopping by my room! What's on your mind today? 💕`,
      timestamp: '10:02 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "Hey gorgeous! 😍",
    "Are you free for a video call?",
    "Send me a selfie! 📸",
    "Where are you from?",
    "You have such a lovely smile ✨"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sounds.playMessagePop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Trigger realistic Sofia reply with typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      sounds.playMessagePop();

      let reply = `I'm so glad you said that! You made my day 😊`;
      const lower = text.toLowerCase();
      if (lower.includes('video') || lower.includes('cam')) {
        reply = `Yes!! Tap the pink "JOIN FREE CALL" button at the top to connect with me right now! I'm ready 💖`;
      } else if (lower.includes('selfie') || lower.includes('photo')) {
        reply = `Here is a fresh photo from today's set just for you! Hope you like it ✨`;
      } else if (lower.includes('where') || lower.includes('from')) {
        reply = `I'm currently based in sunny ${creator.location || 'Miami'}! Where are you connecting from?`;
      } else if (lower.includes('gorgeous') || lower.includes('beautiful') || lower.includes('pretty')) {
        reply = `Aww thank you sweetheart! That's so kind of you 🥰 Sending you big hugs!`;
      }

      const creatorMsg: ChatMessage = {
        id: `creator-${Date.now()}`,
        sender: 'creator',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mediaUrl: (lower.includes('selfie') || lower.includes('photo')) ? creator.avatarUrl : undefined
      };

      setMessages(prev => [...prev, creatorMsg]);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
      <div className="relative w-full max-w-md h-[90vh] max-h-[750px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30 flex flex-col justify-between">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-purple-500/20 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={creator.avatarUrl} 
                alt={creator.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm">{creator.name}</span>
                <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.2 rounded border border-purple-700/50">
                  {creator.age}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                {isTyping ? 'typing...' : 'Active Now'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onStartVideoCall}
              className="w-8 h-8 rounded-full bg-pink-600/30 hover:bg-pink-600 text-pink-300 hover:text-white flex items-center justify-center transition-colors"
              title="Start Video Call"
            >
              <Video size={16} />
            </button>
            <button 
              onClick={onStartAudioCall}
              className="w-8 h-8 rounded-full bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white flex items-center justify-center transition-colors"
              title="Start Audio Call"
            >
              <Phone size={16} />
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-950 via-[#100b21] to-slate-950">
          {/* Welcome notification banner */}
          <div className="text-center my-2">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-[11px] text-purple-300">
              🔒 End-to-end private direct messaging room
            </div>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
              >
                <div 
                  className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-900 border border-purple-900/40 text-slate-100 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.mediaUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-white/20">
                      <img 
                        src={msg.mediaUrl} 
                        alt="Sofia attachment" 
                        className="w-full max-h-56 object-cover" 
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 px-1">
                  <span>{msg.timestamp}</span>
                  {isUser && <CheckCheck size={12} className="text-purple-400" />}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 bg-slate-900 border border-purple-900/40 px-3 py-2 rounded-2xl w-fit rounded-bl-xs">
              <span className="text-[11px] text-slate-400">{creator.name} is typing</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-slate-900/60 border-t border-purple-900/20 flex gap-2 overflow-x-auto no-scrollbar">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(reply)}
              className="text-xs text-purple-200 bg-purple-950/70 hover:bg-purple-800/80 px-2.5 py-1 rounded-full border border-purple-800/40 whitespace-nowrap shrink-0 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-purple-900/30 flex items-center gap-2">
          <button 
            type="button"
            onClick={() => handleSendMessage("Send me a selfie! 📸")}
            className="w-9 h-9 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
            title="Request Selfie"
          >
            <ImageIcon size={18} />
          </button>

          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message ${creator.name}...`}
            className="flex-1 bg-slate-950 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-purple-900/50 focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
          />

          <button 
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-md"
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
