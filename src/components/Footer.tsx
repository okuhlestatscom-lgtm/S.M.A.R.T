import React from 'react';
import { Flame, ShieldCheck, Mail, MapPin, Bell, Bookmark, MessageCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { WHATSAPP_NUMBER, FACEBOOK_URL } from './WhatsAppWidget';
import { YOUTUBE_CHANNEL_URL } from '../data/smartData';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenSubscribe: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSubscribe,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Mandate */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/aistudio/file_000000007c2c8208b2cc5202023513b7_3aeb00d7.png"
                alt="S.M.A.R.T Seal"
                className="w-12 h-12 rounded-full border-2 border-amber-500/60 shadow shrink-0"
              />
              <div>
                <span className="font-cinzel text-lg font-bold tracking-wider text-amber-400 block leading-none">
                  S.M.A.R.T
                </span>
                <span className="text-[10px] text-slate-300 tracking-wider font-mono">
                  The Smart Leaders Family Of Churches
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              <strong className="text-white">SOUND MINISTRY AND REFORMATION TOOLS</strong> — Founded by Apostle Nicholas Dlamini to provide valuable Apostolic and prophetic resources for kingdom building in the 21st century.
            </p>

            {/* Official Social Action Cards: WhatsApp, Facebook & YouTube */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 pt-1">
              <a
                href="https://wa.me/26879309372"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {WHATSAPP_NUMBER}</span>
              </a>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-950/60 border border-blue-600/50 text-blue-300 hover:text-white hover:bg-blue-900/60 transition-colors text-xs font-semibold"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
                <ExternalLink className="w-3 h-3 text-blue-400" />
              </a>

              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-950/60 border border-red-600/50 text-red-300 hover:text-white hover:bg-red-900/60 transition-colors text-xs font-semibold"
              >
                <svg className="w-4 h-4 fill-current text-red-500" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>YouTube: Intense Word</span>
                <ExternalLink className="w-3 h-3 text-red-400" />
              </a>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 italic font-editorial">
              "According to the grace of God given to me, like a wise master builder I laid a foundation, and someone else is building upon it." — 1 Corinthians 3:10
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider mb-4">
              Apostolic Vault
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('teachings')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Sound Doctrine Teachings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reports')}
                  className="hover:text-amber-400 transition-colors text-left text-amber-300 font-semibold"
                >
                  Reports & Revival Dispatches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('teachings')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Audio Sermons & Podcasts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('itinerary')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Live Calendar & Whereabouts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 text-amber-300 font-semibold"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>My Saved Library</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Books by Nicholas Dlamini */}
          <div>
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider mb-4">
              Books by Nicholas Dlamini
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('books')}
                  className="hover:text-amber-400 transition-colors text-left font-medium"
                >
                  How to Operate in Secular Babylon (R399)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('books')}
                  className="hover:text-amber-400 transition-colors text-left font-medium"
                >
                  The Apostolic and Prophetic Prayer Manual (R350)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('books')}
                  className="hover:text-amber-400 transition-colors text-left font-medium"
                >
                  Five Senses of Successful Leaders (R100)
                </button>
              </li>
              <li>
                <a
                  href="https://books2read.com/u/3nBkvB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 text-[11px]"
                >
                  <span>Books2Read Global Store</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Follower Alerts & Admin Control */}
          <div className="space-y-4">
            <div>
              <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider mb-2">
                Follower Live Alerts
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Push notifications for new reports, announcements, and live broadcasts.
              </p>
              <button
                onClick={onOpenSubscribe}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Push Notifications</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-600/40 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Minister's Admin Backend</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} S.M.A.R.T (Sound Ministry and Reformation Tools) — Apostle Nicholas Dlamini. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>WhatsApp: {WHATSAPP_NUMBER}</span>
            <span>·</span>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              Facebook Page
            </a>
            <span>·</span>
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
              YouTube Channel
            </a>
            <span>·</span>
            <span>Biblical Alignment</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
