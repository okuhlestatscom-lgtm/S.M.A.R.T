import React, { useState, useEffect } from 'react';
import { 
  Bell, Check, Volume2, X, Radio, BookOpen, MapPin, Headphones, Send, 
  Sparkles, FileText, Megaphone, ShieldCheck, Image as ImageIcon, 
  Maximize2, Download, ExternalLink, Eye, Filter
} from 'lucide-react';
import { NotificationItem } from '../data/smartData';
import { soundEffects } from '../services/soundEffects';
import { notificationService, PushPreferences } from '../services/notificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'subscribe'>('feed');
  const [feedFilter, setFeedFilter] = useState<'all' | 'posters' | 'live' | 'books'>('all');
  const [subscriberName, setSubscriberName] = useState('');
  const [subscriberContact, setSubscriberContact] = useState('');
  const [notifyReports, setNotifyReports] = useState(true);
  const [notifyLive, setNotifyLive] = useState(true);
  const [notifyTeachings, setNotifyTeachings] = useState(true);
  const [notifyBooks, setNotifyBooks] = useState(true);
  const [notifyItinerary, setNotifyItinerary] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [pushStatus, setPushStatus] = useState<string>('default');
  const [activeLightbox, setActiveLightbox] = useState<{
    imageUrl: string;
    title: string;
    caption?: string;
    targetTab?: string;
    actionLabel?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestChime = () => {
    soundEffects.playAlertChime();
  };

  const handleEnableWebPush = async () => {
    const granted = await notificationService.requestPushPermission();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playAlertChime();
    notificationService.savePreferences({
      enabled: true,
      reportsAndAnnouncements: notifyReports,
      liveBroadcasts: notifyLive,
      newTeachings: notifyTeachings,
      bookReleases: notifyBooks
    });
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setActiveSubTab('feed');
      setSubscriberName('');
      setSubscriberContact('');
    }, 2500);
  };

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'live':
        return <Radio className="w-4 h-4 text-rose-400" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'itinerary':
        return <MapPin className="w-4 h-4 text-blue-400" />;
      case 'teaching':
        return <Headphones className="w-4 h-4 text-emerald-400" />;
      case 'report':
        return <FileText className="w-4 h-4 text-amber-300" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-sky-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-white">
                Follower Notification Center
              </h3>
              <p className="text-[11px] text-slate-400">
                Push alerts for reports, live events, books & sound doctrine uploads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestChime}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 text-xs flex items-center gap-1 transition-colors"
              title="Test Sound Chime"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Test Chime</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs: Live Feed vs Subscribe */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              activeSubTab === 'feed'
                ? 'border-amber-400 text-amber-400 font-semibold bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setActiveSubTab('subscribe')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              activeSubTab === 'subscribe'
                ? 'border-amber-400 text-amber-400 font-semibold bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Push Alert Preferences
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {activeSubTab === 'feed' ? (
            <>
              {/* Native Push Notification Banner */}
              {pushStatus !== 'granted' && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/50 to-slate-900 border border-amber-600/40 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">
                      Enable Browser Push Notifications
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Receive alerts even when your browser tab is in the background.
                    </span>
                  </div>
                  <button
                    onClick={handleEnableWebPush}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap shadow"
                  >
                    Enable Push
                  </button>
                </div>
              )}

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
                <button
                  onClick={() => setFeedFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                    feedFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFeedFilter('posters')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                    feedFilter === 'posters'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  Posters & Covers ({notifications.filter(n => !!n.imageUrl).length})
                </button>
                <button
                  onClick={() => setFeedFilter('live')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                    feedFilter === 'live'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className="w-3 h-3 text-rose-500" />
                  Live Broadcasts
                </button>
                <button
                  onClick={() => setFeedFilter('books')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                    feedFilter === 'books'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3 h-3 text-amber-500" />
                  Books & Releases
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span>Ministerial Dispatches from Apostle Nicholas Dlamini</span>
                <button
                  onClick={onMarkAllAsRead}
                  className="text-amber-400 hover:underline text-[11px]"
                >
                  Mark all as read
                </button>
              </div>

              {notifications
                .filter((item) => {
                  if (feedFilter === 'posters') return Boolean(item.imageUrl);
                  if (feedFilter === 'live') return item.type === 'live';
                  if (feedFilter === 'books') return item.type === 'book';
                  return true;
                })
                .map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.urgent
                      ? 'bg-amber-950/20 border-amber-600/50'
                      : item.read
                      ? 'bg-slate-950/40 border-slate-800'
                      : 'bg-slate-800/60 border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {getIconForType(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-white leading-snug">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {item.message}
                      </p>

                      {/* Attached Poster / Book Cover Preview */}
                      {item.imageUrl && (
                        <div className="mt-3 rounded-lg overflow-hidden border border-amber-500/30 bg-slate-950/80 group">
                          <div 
                            className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-slate-900 cursor-pointer"
                            onClick={() => setActiveLightbox({
                              imageUrl: item.imageUrl!,
                              title: item.title,
                              caption: item.imageCaption,
                              targetTab: item.targetTab,
                              actionLabel: item.actionLabel,
                            })}
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-semibold text-amber-400 border border-amber-500/40 flex items-center gap-1 shadow">
                              <ImageIcon className="w-3 h-3" /> Official Flyer / Poster
                            </span>
                            <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow-lg transition-transform group-hover:scale-105">
                              <Maximize2 className="w-3 h-3" /> Enlarge Poster
                            </span>
                          </div>
                          {item.imageCaption && (
                            <div className="px-3 py-1.5 text-[11px] text-amber-200/90 bg-amber-950/50 border-t border-amber-950/80 flex items-center justify-between">
                              <span className="truncate pr-2 font-medium">{item.imageCaption}</span>
                              <button
                                onClick={() => setActiveLightbox({
                                  imageUrl: item.imageUrl!,
                                  title: item.title,
                                  caption: item.imageCaption,
                                  targetTab: item.targetTab,
                                  actionLabel: item.actionLabel,
                                })}
                                className="text-amber-400 hover:text-amber-300 text-[10px] font-semibold flex items-center gap-0.5 shrink-0"
                              >
                                <Eye className="w-3 h-3" /> Full View
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        {item.targetTab && (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToTab(item.targetTab!);
                            }}
                            className="px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-semibold text-amber-400 inline-flex items-center gap-1 transition-colors"
                          >
                            <span>{item.actionLabel || `Open in ${item.targetTab}`}</span>
                            <span>→</span>
                          </button>
                        )}
                        {item.imageUrl && (
                          <button
                            onClick={() => setActiveLightbox({
                              imageUrl: item.imageUrl!,
                              title: item.title,
                              caption: item.imageCaption,
                              targetTab: item.targetTab,
                              actionLabel: item.actionLabel,
                            })}
                            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3 text-amber-400" />
                            <span>View Poster</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* Follower Subscription & Push Settings */
            <div>
              {isSubscribed ? (
                <div className="p-6 text-center bg-emerald-950/40 border border-emerald-800/60 rounded-xl my-4">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white">Preferences Updated!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    You will now receive high-priority alerts whenever Apostle Nicholas Dlamini publishes reports, books, or goes live.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="space-y-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 leading-relaxed">
                    🔔 Never miss an emergency live apostolic impartation, new field report, or ministerial tour visit to your territory.
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pastor David Khumalo"
                      value={subscriberName}
                      onChange={(e) => setSubscriberName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email or WhatsApp Phone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="email@example.com or +268 76... / +27 82..."
                      value={subscriberContact}
                      onChange={(e) => setSubscriberContact(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Notification Checkboxes */}
                  <div className="pt-2 space-y-2 border-t border-slate-800">
                    <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Select Alert Categories:
                    </span>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyReports}
                        onChange={(e) => setNotifyReports(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Ministerial Reports & Revival Dispatches</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyLive}
                        onChange={(e) => setNotifyLive(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Emergency Live Events & Broadcasts (Facebook / Audio)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyTeachings}
                        onChange={(e) => setNotifyTeachings(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span>New Teachings (Audio sermons, Video masterclasses, PDF notes)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyBooks}
                        onChange={(e) => setNotifyBooks(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Book Releases, eBook Chapters & Building Fund Updates</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyItinerary}
                        onChange={(e) => setNotifyItinerary(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Ministerial Whereabouts & Tour Schedule Announcements</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Activate Follower Alerts</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Full-Screen Interactive Lightbox for Posters & Covers */}
      {activeLightbox && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setActiveLightbox(null)}
        >
          <div 
            className="w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {activeLightbox.title}
                  </h4>
                  <span className="text-[10px] text-amber-400 font-medium">
                    Apostle Nicholas Dlamini • Sound Ministry & Reformation Tools
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeLightbox.imageUrl}
                  download="Apostle_Nicholas_Dlamini_Poster.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs flex items-center gap-1.5 transition-colors border border-slate-700 shadow-sm"
                  title="Download Poster Flyer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-xs">Save Flyer</span>
                </a>
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lightbox Image Preview Area */}
            <div className="p-3 sm:p-4 bg-black/60 flex items-center justify-center overflow-auto max-h-[62vh] relative">
              <img
                src={activeLightbox.imageUrl}
                alt={activeLightbox.title}
                className="max-h-[58vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-amber-500/20"
              />
            </div>

            {/* Lightbox Footer with Caption & Action */}
            <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-300 text-[11px] sm:text-xs leading-relaxed text-center sm:text-left">
                {activeLightbox.caption ? (
                  <p className="text-amber-200/90 font-medium">{activeLightbox.caption}</p>
                ) : (
                  <p className="text-slate-400">Official promotional flyer published by S.M.A.R.T Administration.</p>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                {activeLightbox.targetTab && (
                  <button
                    onClick={() => {
                      const tab = activeLightbox.targetTab!;
                      setActiveLightbox(null);
                      onClose();
                      onNavigateToTab(tab);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{activeLightbox.actionLabel || `Go to ${activeLightbox.targetTab}`}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

