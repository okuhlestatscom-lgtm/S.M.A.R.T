import React from 'react';
import { Bell, Flame, ShieldAlert, Bookmark, UserCheck, MessageCircle, Globe, ExternalLink, ShieldCheck, User, WifiOff, Download } from 'lucide-react';
import { NotificationItem, UserProfile, YOUTUBE_CHANNEL_URL } from '../data/smartData';
import { WHATSAPP_NUMBER, FACEBOOK_URL } from './WhatsAppWidget';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { downloadOfflineHtmlService } from '../services/downloadOfflineHtmlService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationItem[];
  savedBookmarksCount: number;
  currentUser: UserProfile | null;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  onOpenSubscribe: () => void;
  onOpenGoogleAuth: () => void;
  onOpenOfflineHtml?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  savedBookmarksCount,
  currentUser,
  onOpenNotifications,
  onOpenAdmin,
  onOpenSubscribe,
  onOpenGoogleAuth,
  onOpenOfflineHtml,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element wordmark with official seal) */}
        <button
          onClick={() => setActiveTab('overview')}
          className="text-left flex items-center gap-3 group focus:outline-none shrink-0"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-lg shadow-amber-950/40 group-hover:scale-105 transition-transform shrink-0 bg-black">
            <img
              src="/assets/aistudio/file_000000007c2c8208b2cc5202023513b7_3aeb00d7.png"
              alt="Sound Ministry and Reformation Tools Logo - The Smart Leaders Family Of Churches"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-xl font-bold tracking-wider text-amber-400 whitespace-nowrap shrink-0 group-hover:text-amber-300 transition-colors leading-none">
              S.M.A.R.T
            </span>
            <span className="text-[10px] tracking-widest text-slate-300 uppercase font-sans font-semibold whitespace-nowrap mt-1">
              Sound Ministry & Reformation Tools
            </span>
            <span className="text-[9px] text-amber-300/80 font-editorial italic whitespace-nowrap">
              The Smart Leaders Family Of Churches
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'overview'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Vision
          </button>
          <button
            onClick={() => setActiveTab('teachings')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'teachings'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Teachings Vault
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
            title="Browse all 5 content categories and thematic tags"
          >
            <span>Catalog & Tags</span>
            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] rounded-full font-mono font-bold">
              5
            </span>
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'books'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Books for Sale
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'reports'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Reports & Dispatches
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'itinerary'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Calendar & Whereabouts
          </button>
          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'diagnostic'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            Diagnostic
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Library</span>
            {savedBookmarksCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] rounded-full font-mono font-bold">
                {savedBookmarksCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Direct Social Links, Google User Sync, Alerts & Admin Backend */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* YouTube Channel Direct Link */}
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 hover:text-white hover:bg-red-900/60 transition-colors text-xs font-medium"
            title="Intense Word Sessions With Nicholas Dlamini on YouTube"
          >
            <svg className="w-3.5 h-3.5 fill-current text-red-500" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="hidden md:inline">YouTube</span>
          </a>

          {/* Facebook Official Page Direct Link */}
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-blue-950/40 border border-blue-800/60 text-blue-300 hover:text-white hover:bg-blue-900/60 transition-colors text-xs font-medium"
            title="Apostle Nicholas Dlamini Facebook Page"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="hidden md:inline">Facebook</span>
          </a>

          {/* WhatsApp Direct Header Link */}
          <a
            href={`https://wa.me/26879309372`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors text-xs font-medium"
            title="Chat on WhatsApp +268 7930 9372"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">+268 7930 9372</span>
          </a>

          {/* Google Account Sign-In / User Profile Badge */}
          <button
            onClick={onOpenGoogleAuth}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all text-xs ${
              currentUser
                ? 'bg-slate-900 border-amber-600/50 text-white hover:border-amber-400'
                : 'bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-sm'
            }`}
            title={currentUser ? `Google Account: ${currentUser.email}` : 'Sign in with Google to back up My Library'}
          >
            {currentUser ? (
              <>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full border border-amber-500 object-cover"
                />
                <div className="hidden md:flex flex-col text-left leading-tight">
                  <span className="font-semibold text-white text-[11px] truncate max-w-[90px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono">
                    Google Backed Up
                  </span>
                </div>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline text-xs font-semibold">Google Sign In</span>
              </>
            )}
          </button>

          {/* Notification Center Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 transition-colors"
            title="Follower Live Alerts & Reports"
            aria-label="Follower Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick jump to My Library */}
          <button
            onClick={() => setActiveTab('library')}
            className={`relative p-2.5 rounded-lg border transition-colors ${
              activeTab === 'library'
                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                : 'bg-slate-900 border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-400'
            }`}
            title="Open My Library (Saved Items)"
            aria-label="My Saved Library"
          >
            <Bookmark className="w-4 h-4" />
            {savedBookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {savedBookmarksCount}
              </span>
            )}
          </button>

          {/* Network Status Badge if Offline */}
          {!isOnline && (
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold animate-pulse">
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>Offline Mode</span>
            </span>
          )}

          {/* Download Standalone Offline HTML Button */}
          <button
            onClick={() => onOpenOfflineHtml ? onOpenOfflineHtml() : downloadOfflineHtmlService.downloadStandaloneHtml()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-300 hover:text-white transition-all text-xs font-semibold shadow-sm shrink-0 cursor-pointer"
            title="Download complete portal as a standalone offline HTML file"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Download HTML</span>
            <span className="lg:hidden">HTML</span>
          </button>

          {/* PWA In-App Install Prompt */}
          <PWAInstallButton variant="nav" />

          {/* Minister Nicholas Dlamini Admin Backend */}
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:from-amber-300 hover:to-amber-400 shadow-sm transition-all whitespace-nowrap shrink-0"
            title="Open Admin Backend Control Panel"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Backend</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="xl:hidden flex items-center justify-start border-t border-slate-800/80 px-2 py-2 overflow-x-auto text-xs bg-slate-950/95 gap-2 no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Vision
        </button>
        <button
          onClick={() => setActiveTab('teachings')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'teachings' ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Teachings
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'catalog' ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Catalog & Tags
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'books' ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Books for Sale
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'reports' ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Reports & Dispatches
        </button>
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'itinerary' ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Calendar
        </button>
        <button
          onClick={() => setActiveTab('diagnostic')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
            activeTab === 'diagnostic' ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Diagnostic
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'library' ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <span>Library</span>
          {savedBookmarksCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] rounded-full font-bold">
              {savedBookmarksCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onOpenOfflineHtml ? onOpenOfflineHtml() : downloadOfflineHtmlService.downloadStandaloneHtml()}
          className="px-2.5 py-1 rounded-md whitespace-nowrap flex items-center gap-1 bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 cursor-pointer"
          title="Download standalone offline HTML file"
        >
          <Download className="w-3 h-3 text-amber-400" />
          <span>Save HTML</span>
        </button>
      </div>
    </header>
  );
};
