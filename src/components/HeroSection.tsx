import React from 'react';
import { Flame, Compass, BookOpen, MapPin, Radio, ArrowRight, ShieldCheck, CheckCircle2, Bookmark, Tags, Download } from 'lucide-react';
import { downloadOfflineHtmlService } from '../services/downloadOfflineHtmlService';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onOpenLive: () => void;
  onOpenSubscribe: () => void;
  savedCount: number;
  onOpenOfflineHtml?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenLive,
  onOpenSubscribe,
  savedCount,
  onOpenOfflineHtml,
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pb-24">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-amber-700/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Live Event Alert Ribbon */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-600/40 p-3 sm:p-4 shadow-xl shadow-amber-950/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
                  <span>Apostolic Live Broadcast Alert</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-amber-300 font-sans normal-case">Upcoming Session with Apostle Nicholas Dlamini</span>
                </div>
                <p className="text-sm text-slate-200 mt-0.5 font-medium">
                  Operating in Secular Babylon & Igniting Perpetual Fire upon the Altar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
              <button
                onClick={onOpenLive}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
              >
                <Radio className="w-3.5 h-3.5 text-slate-950" />
                <span>Join Broadcast Room</span>
              </button>
              <button
                onClick={onOpenSubscribe}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
              >
                Get Live SMS/Push
              </button>
            </div>
          </div>
        </div>

        {/* Hero Split Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-16">
          
          {/* Column 1: Vision & Mission Callout */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Editorial Kicker */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/file_000000007c2c8208b2cc5202023513b7_3aeb00d7.png"
                alt="S.M.A.R.T Seal"
                className="w-8 h-8 rounded-full border border-amber-500/60 shadow shrink-0"
              />
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-mono">
                The Smart Leaders Family Of Churches · Apostle Nicholas Dlamini
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold tracking-tight text-white leading-[1.1] text-balance">
              Equipping <span className="text-amber-400">Fivefold Builders</span> to Build Accurately.
            </h1>

            {/* Vision & Mission Core Statements */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                  Our Apostolic Vision
                </span>
                <p className="text-base sm:text-lg text-slate-200 font-editorial italic leading-relaxed">
                  "To provide valuable Apostolic and prophetic resources for kingdom building in the 21st century."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                  Our Mandated Mission
                </span>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  To help the younger generation of fivefold ministry builders and preachers avoid the traps that cause delays in ministry success by providing them with cutting-edge revelation that aligns them according to sound doctrine.
                </p>
              </div>
            </div>

            {/* CTAs & Social Connections */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('books')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/20 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-4 h-4 fill-slate-950" />
                <span>Buy Books Online & Order Prints</span>
              </button>

              <button
                onClick={() => onOpenOfflineHtml ? onOpenOfflineHtml() : downloadOfflineHtmlService.downloadStandaloneHtml()}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/50 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 shadow-md cursor-pointer"
                title="Download or view self-contained offline HTML file"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Offline HTML</span>
              </button>

              <button
                onClick={() => onNavigate('teachings')}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs border border-slate-700 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Teachings Vault</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              
              <button
                onClick={() => onNavigate('catalog')}
                className="px-4 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold text-xs border border-amber-500/40 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
              >
                <Tags className="w-3.5 h-3.5 text-amber-400" />
                <span>5 Categories & Tags</span>
              </button>
              
              <button
                onClick={() => onNavigate('library')}
                className="px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 font-medium text-xs border border-amber-800/40 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>My Library ({savedCount})</span>
              </button>

              <a
                href="https://wa.me/26879309372"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 font-medium text-xs border border-emerald-600/50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>WhatsApp: +268 7930 9372</span>
              </a>

              <a
                href="https://www.facebook.com/share/18VLSJkDEC/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 font-medium text-xs border border-blue-600/50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook Page</span>
              </a>
            </div>

            {/* Credibility Markers */}
            <div className="flex items-center gap-6 pt-2 text-xs text-slate-400 font-medium border-t border-slate-800/70">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Biblical Sound Doctrine
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Flame className="w-4 h-4 text-amber-400" />
                Holy Ghost Fire Altars
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400" />
                Global Itinerary
              </span>
            </div>
          </div>

          {/* Column 2: Apostle Portrait & Real Book Showcase */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Real Photograph of Apostle Nicholas Dlamini */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-600/30 bg-slate-900 shadow-2xl group">
              <img
                src="/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg"
                alt="Apostle Nicholas Dlamini"
                className="w-full aspect-[4/5] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[11px] font-mono uppercase tracking-wider mb-2">
                  <span>Author & Apostolic Leader</span>
                  <span className="text-amber-500">·</span>
                  <span>10+ Published Volumes</span>
                </div>
                <h3 className="text-xl font-cinzel font-bold text-white">
                  Apostle Nicholas Dlamini
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  Founder of S.M.A.R.T & The Smart Leaders Family Of Churches. Available on Books2Read (Kindle, Apple, Kobo) & in Print.
                </p>
                
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-medium">Digital & Print Editions:</span>
                  <button
                    onClick={() => onNavigate('books')}
                    className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    Browse Books2Read & Print Copies <ArrowRight className="w-3 h-3 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mini preview strip of his books for sale */}
            <div className="grid grid-cols-3 gap-2 p-2 bg-slate-900/90 rounded-xl border border-slate-800">
              <button
                onClick={() => onNavigate('books')}
                className="relative rounded-lg overflow-hidden border border-slate-700 hover:border-amber-500 transition-colors group aspect-[3/4]"
              >
                <img
                  src="/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg"
                  alt="How to Operate in Secular Babylon"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[10px] font-bold text-amber-400 font-mono py-0.5 text-center">
                  R399
                </span>
              </button>

              <button
                onClick={() => onNavigate('books')}
                className="relative rounded-lg overflow-hidden border border-slate-700 hover:border-amber-500 transition-colors group aspect-[3/4]"
              >
                <img
                  src="/assets/aistudio/FB_IMG_1793479322670_4123012d.jpg"
                  alt="The Apostolic and Prophetic Prayer Manual"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[10px] font-bold text-amber-400 font-mono py-0.5 text-center">
                  R350
                </span>
              </button>

              <button
                onClick={() => onNavigate('books')}
                className="relative rounded-lg overflow-hidden border border-slate-700 hover:border-amber-500 transition-colors group aspect-[3/4]"
              >
                <img
                  src="/assets/aistudio/FB_IMG_1793479335252_6e135219.jpg"
                  alt="Five Senses of Successful Leaders"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[10px] font-bold text-amber-400 font-mono py-0.5 text-center">
                  R100
                </span>
              </button>
            </div>

          </div>

        </div>

        {/* The 4 Core Goals Grid */}
        <div className="border-t border-slate-800/80 pt-12">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Foundational Directives
            </span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
              The Four Mandated Goals of S.M.A.R.T
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Guiding every book, teaching, sermon, itinerary visitation, and leadership diagnostic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Goal 1 */}
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="font-cinzel font-semibold text-base text-white mb-2">
                  Think Biblically, Build Accurately & Live Strategically
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transforming the mindset of believers and fivefold leaders from carnal ambition to pure scriptural architecture and strategic discipline.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-amber-300 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>1 Corinthians 3:10</span>
              </div>
            </div>

            {/* Goal 2 */}
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="font-cinzel font-semibold text-base text-white mb-2">
                  Provide Sound Ministry & Reformation Tools
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Equipping pastors, prophets, and ministers with robust books, blueprints, monographs, and audio/video expositions to prevent ministry delay.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-amber-300 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Titus 1:9 · 2 Tim 3:16</span>
              </div>
            </div>

            {/* Goal 3 */}
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="font-cinzel font-semibold text-base text-white mb-2">
                  Catalyst for End-Time Revival
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Igniting territorial awakening in every community, city, and nation through uncompromised apostolic truth and prophetic accuracy.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-amber-300 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Habakkuk 3:2 · Acts 19:20</span>
              </div>
            </div>

            {/* Goal 4 */}
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="font-cinzel font-semibold text-base text-white mb-2">
                  Restore Holy Spirit Fire in Local Churches
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dethroning mechanical entertainment and rekindling burning prayer altars where the real supernatural power of God transforms lives.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-amber-300 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Leviticus 6:13 · Luke 3:16</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
