import React, { useState } from 'react';
import { X, Radio, MessageSquare, Send, Heart, Users, Sparkles, Flame, Check } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface LiveBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveBroadcastModal: React.FC<LiveBroadcastModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Pastor Emmanuel (Lagos)', text: 'The apostolic order in this message is cutting through tradition! Amen!' },
    { sender: 'Minister Grace (London)', text: 'Fire on the altar! We are aligning our leadership according to Ephesians 4.' },
    { sender: 'Elder Marcus (Atlanta)', text: 'Apostle Nicholas, this revelation on avoiding premature promotion has saved our ministry.' },
    { sender: 'Prophetess Sarah (Johannesburg)', text: 'Receiving the impartation for sound doctrine across Southern Africa!' }
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [senderName, setSenderName] = useState('');
  const [prayerPetition, setPrayerPetition] = useState('');
  const [petitionSent, setPetitionSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'prayer'>('chat');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: senderName || 'Kingdom Builder', text: newMsg.trim() }
    ]);
    setNewMsg('');
  };

  const handleSendPetition = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playAlertChime();
    setPetitionSent(true);
    setTimeout(() => {
      setPetitionSent(false);
      setPrayerPetition('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-5xl bg-slate-900 border border-amber-600/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Top Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
              SMART Global Apostolic Live Stream
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-xs text-slate-300 font-medium">
              Apostle Nicholas Dlamini Ministration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>3,418 Ministers Connected</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Grid: Stream & Live Interaction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Stream Column */}
          <div className="lg:col-span-8 bg-black flex flex-col justify-between relative overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src="/src/assets/images/hero_apostolic_assembly_1793478515668.jpg"
                alt="Apostle Nicholas Abraham Ministering Live"
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/30 pointer-events-none" />

              {/* Stream Title Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-white">
                  <span className="font-semibold text-amber-400">Theme:</span> Laying Bedrock Foundations for End-Time Revival
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.facebook.com/share/18VLSJkDEC/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 shadow transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Watch on Facebook Live</span>
                  </a>
                  <div className="bg-red-600/90 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                    LIVE 1080p
                  </div>
                </div>
              </div>

              {/* Center Preaching Indicator */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
                <div className="flex items-center justify-between text-xs text-amber-400 font-mono mb-1">
                  <span>Apostle Nicholas Dlamini</span>
                  <span>Leviticus 6:13 · 1 Cor 3:10</span>
                </div>
                <p className="text-sm text-slate-200 font-editorial italic leading-relaxed">
                  "The fire upon the altar shall never go out. When sound doctrine is restored, the supernatural power of the Holy Ghost returns to our churches!"
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Column (Live Chat & Prayer Petitions) */}
          <div className="lg:col-span-4 bg-slate-950 flex flex-col border-l border-slate-800">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                  activeTab === 'chat'
                    ? 'border-amber-400 text-amber-400 font-semibold bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Live Fellowship Chat
              </button>
              <button
                onClick={() => setActiveTab('prayer')}
                className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                  activeTab === 'prayer'
                    ? 'border-amber-400 text-amber-400 font-semibold bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Submit Prophetic Petition
              </button>
            </div>

            {/* Chat View */}
            {activeTab === 'chat' ? (
              <div className="flex flex-col flex-1 overflow-hidden p-4">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="font-semibold text-amber-400 block font-mono text-[11px]">
                        {msg.sender}
                      </span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Chat Form */}
                <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Pastor David, Dallas)"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Type Amen or prophetic response..."
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center justify-center shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Prayer Petition Form */
              <div className="p-5 flex-1 overflow-y-auto">
                {petitionSent ? (
                  <div className="p-6 text-center bg-emerald-950/40 border border-emerald-800/60 rounded-xl my-4">
                    <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-white">Petition Dispatched to the Altar</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Apostle Nicholas Abraham and the intercessory council will hold up this petition during the impartation segment of tonight's summit.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendPetition} className="space-y-4">
                    <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-300">
                      🔥 Submit your personal or ministry prayer petition for apostolic intercession during the live session.
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Your Full Name & City
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pastor Samuel (Nairobi)"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Specific Prayer Request or Ministry Need
                      </label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Detail your request: e.g. Breaking delay in church planting, restoration of prayer fire, financial breakthrough for building project..."
                        value={prayerPetition}
                        onChange={(e) => setPrayerPetition(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Flame className="w-4 h-4 fill-slate-950" />
                      <span>Lay Petition on the Altar</span>
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
