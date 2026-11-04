import React, { useState } from 'react';
import { MessageCircle, X, Send, BookOpen, Heart, Calendar, HelpCircle, Check } from 'lucide-react';

export const WHATSAPP_NUMBER = '+268 7930 9372';
export const WHATSAPP_RAW = '26879309372';
export const FACEBOOK_URL = 'https://www.facebook.com/share/18VLSJkDEC/';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const quickPrompts = [
    {
      icon: BookOpen,
      label: 'Book Order Inquiry',
      text: 'Shalom Apostle Nicholas, I would like to order copies of your books (How to Operate in Secular Babylon / Five Senses of Successful Leaders / Prayer Manual) and confirm delivery.'
    },
    {
      icon: Heart,
      label: 'Prayer & Counseling',
      text: 'Shalom Apostle Nicholas, I am reaching out for pastoral prayer and spiritual covering from S.M.A.R.T.'
    },
    {
      icon: Calendar,
      label: 'Ministerial Invitation',
      text: 'Greetings Apostle Nicholas Dlamini, our leadership would like to invite you for an apostolic summit / conference in our city.'
    },
    {
      icon: HelpCircle,
      label: 'General Inquiries & Partnership',
      text: 'Greetings S.M.A.R.T Secretariat, I would like more information on the tools and partnership for our local church.'
    }
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || customMessage.trim() || 'Shalom Apostle Nicholas Dlamini, I am contacting you through the S.M.A.R.T ministry app.';
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_RAW}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
      {/* Expanded Quick Chat Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn backdrop-blur-md">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg"
                  alt="Apostle Nicholas Dlamini"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/80"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-teal-900 rounded-full" />
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">
                  Apostle Nicholas Dlamini
                </h4>
                <p className="text-[11px] text-emerald-200">
                  S.M.A.R.T WhatsApp Secretariat
                </p>
                <p className="text-[10px] text-emerald-300 font-mono font-medium">
                  {WHATSAPP_NUMBER}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts List */}
          <div className="p-4 space-y-3 bg-slate-950/70">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Select an inquiry or write below:
            </p>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {quickPrompts.map((q, idx) => {
                const Icon = q.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q.text)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-600/50 text-slate-300 hover:text-white transition-all flex items-start gap-2.5 text-xs group"
                  >
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium group-hover:text-emerald-300 transition-colors">
                      {q.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your message to Apostle Nicholas..."
                rows={2}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
              <button
                onClick={() => handleSend()}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp ({WHATSAPP_NUMBER})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 transition-all transform hover:scale-105 focus:outline-none"
        aria-label="Contact Apostle Nicholas Dlamini on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold leading-none">
            WhatsApp Apostle
          </span>
          <span className="text-[10px] text-emerald-200 font-mono mt-0.5">
            +268 7930 9372
          </span>
        </div>
      </button>
    </div>
  );
};
