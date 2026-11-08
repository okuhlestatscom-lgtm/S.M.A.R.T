import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Headphones,
  Video,
  FileText,
  BookOpen,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Eye,
  Download,
  Check,
  Sparkles,
  Award,
  PenLine,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { Teaching, Book, JournalEntry } from '../data/smartData';
import { PrayerJournalView } from './PrayerJournalView';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { offlineCacheService } from '../services/offlineCacheService';
import { PWAInstallButton } from './PWAInstallButton';
import { downloadOfflineHtmlService } from '../services/downloadOfflineHtmlService';

interface MyLibrarySectionProps {
  savedTeachings: Teaching[];
  savedBooks: Book[];
  journalEntries: JournalEntry[];
  activeAudioId: string | null;
  onPlayAudio: (teaching: Teaching) => void;
  onOpenVideo: (teaching: Teaching) => void;
  onOpenPdf: (teaching: Teaching) => void;
  onReadBook: (book: Book) => void;
  onOrderBook: (book: Book) => void;
  onToggleTeachingBookmark: (id: string) => void;
  onToggleBookBookmark: (id: string) => void;
  onAddJournalEntry: (entry: JournalEntry) => void;
  onUpdateJournalEntry: (entry: JournalEntry) => void;
  onDeleteJournalEntry: (id: string) => void;
  onNavigate: (tab: string) => void;
  onClearLibrary: () => void;
  onShowToast: (msg: string) => void;
  onOpenOfflineHtml?: () => void;
}

export const MyLibrarySection: React.FC<MyLibrarySectionProps> = ({
  savedTeachings,
  savedBooks,
  journalEntries,
  activeAudioId,
  onPlayAudio,
  onOpenVideo,
  onOpenPdf,
  onReadBook,
  onOrderBook,
  onToggleTeachingBookmark,
  onToggleBookBookmark,
  onAddJournalEntry,
  onUpdateJournalEntry,
  onDeleteJournalEntry,
  onNavigate,
  onClearLibrary,
  onShowToast,
  onOpenOfflineHtml,
}) => {
  const [filter, setFilter] = useState<'all' | 'teachings' | 'books' | 'journal'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<Record<string, boolean>>({});
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const totalCount = savedTeachings.length + savedBooks.length + journalEntries.length;

  useEffect(() => {
    // Read previous sync timestamp
    offlineCacheService.getStats().then((stats) => {
      if (stats.lastSyncedAt) {
        setLastSynced(stats.lastSyncedAt);
      }
    });

    // Automatically prime CacheStorage with saved book covers & ministry assets when online
    if (isOnline && (savedTeachings.length > 0 || savedBooks.length > 0)) {
      offlineCacheService.precacheAllLibraryItems(savedTeachings, savedBooks, journalEntries).then((res) => {
        if (res.success && res.cachedCount > 0) {
          offlineCacheService.getStats().then((s) => setLastSynced(s.lastSyncedAt));
        }
      });
    }
  }, [savedTeachings.length, savedBooks.length, journalEntries.length, isOnline]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const res = await offlineCacheService.precacheAllLibraryItems(
        savedTeachings,
        savedBooks,
        journalEntries
      );
      const stats = await offlineCacheService.getStats();
      setLastSynced(stats.lastSyncedAt);
      setSyncFeedback(`Secured ${res.cachedCount} assets for offline study!`);
      onShowToast(`Offline Vault Synced: ${res.cachedCount} resources ready for offline reading.`);
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch {
      onShowToast('Could not complete offline sync. Please check connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadTeaching = (teaching: Teaching) => {
    const text = `=====================================================
S.M.A.R.T - SOUND MINISTRY AND REFORMATION TOOLS
Apostle Nicholas Dlamini Teaching Vault
=====================================================

TITLE: ${teaching.title}
SUBTITLE: ${teaching.subtitle}
AUTHOR: ${teaching.author}
CATEGORY: ${teaching.category}
SCRIPTURES: ${teaching.scriptures.join(', ')}

-----------------------------------------------------
SYNOPSIS:
${teaching.description}

-----------------------------------------------------
KEY APOSTOLIC REVELATIONS:
${teaching.keyRevelations.map((rev, idx) => `${idx + 1}. ${rev}`).join('\n')}

=====================================================
Website: S.M.A.R.T Portal | Saved in My Library
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${teaching.title.replace(/[^a-zA-Z0-9]/g, '_')}_Apostle_Nicholas.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess((prev) => ({ ...prev, [teaching.id]: true }));
    setTimeout(() => {
      setDownloadSuccess((prev) => ({ ...prev, [teaching.id]: false }));
    }, 2500);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Personalized Ministerial Study Vault</span>
          </div>
          <h2 className="text-3xl font-cinzel font-bold text-white">
            My Library & Bookmarked Resources
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Quickly access your saved sermons, study monographs, and books by Apostle Nicholas Dlamini for personal devotion, sermon preparation, and leadership alignment.
          </p>
        </div>

        {totalCount > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={onClearLibrary}
              className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors py-1 px-2.5 rounded hover:bg-slate-900"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Saved Library</span>
            </button>
          </div>
        )}
      </div>

      {/* PWA Offline Study & Caching Vault Status Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/20 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`p-2.5 rounded-xl shrink-0 ${isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'}`}>
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-cinzel text-sm font-bold text-white">
                PWA Offline Study Vault
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isOnline ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Online · Auto-Cached to Device</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-400" />
                    <span>Offline Mode · Cached Vault Active</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isOnline
                ? 'Your saved teachings, sermon notes, book chapters, and prayer petitions are cached locally so you can continue reading in rural or zero-connectivity zones.'
                : 'You are currently disconnected. All bookmarked monographs, revelations, book sample chapters, and prayer notes below remain 100% accessible.'}
              {lastSynced && <span className="text-slate-500 font-mono ml-1.5 hidden sm:inline">(Synced: {lastSynced})</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => onOpenOfflineHtml ? onOpenOfflineHtml() : downloadOfflineHtmlService.downloadStandaloneHtml()}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Download full standalone HTML app for offline study"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Standalone HTML</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Refresh local offline cache"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Cache'}</span>
          </button>

          <PWAInstallButton variant="badge" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            filter === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Saved Items ({totalCount})
        </button>

        <button
          onClick={() => setFilter('teachings')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            filter === 'teachings'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Saved Teachings ({savedTeachings.length})
        </button>

        <button
          onClick={() => setFilter('books')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            filter === 'books'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Saved Books ({savedBooks.length})
        </button>

        <button
          onClick={() => setFilter('journal')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            filter === 'journal'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <PenLine className="w-3.5 h-3.5 text-amber-400" />
          <span>My Prayer Journal ({journalEntries.length})</span>
        </button>
      </div>

      {/* Empty State */}
      {totalCount === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 max-w-xl mx-auto my-6">
          <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-cinzel text-lg font-bold text-white">
            Your Personal Library is Empty
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Save your favorite audio sermons, video masterclasses, study monographs, and books by clicking the bookmark icon on any item.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('teachings')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Explore Teachings Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('books')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors"
            >
              <span>Browse Books for Sale</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* 1. Saved Teachings Section */}
          {(filter === 'all' || filter === 'teachings') && savedTeachings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Saved Teachings ({savedTeachings.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTeachings.map((teaching) => {
                  const isPlaying = activeAudioId === teaching.id;

                  return (
                    <div
                      key={teaching.id}
                      className="flex flex-col justify-between rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-600/40 p-5 shadow-lg relative"
                    >
                      <div>
                        {/* Top row with category and bookmark button */}
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="font-semibold text-amber-400">{teaching.category}</span>
                          <button
                            onClick={() => onToggleTeachingBookmark(teaching.id)}
                            className="p-1 rounded text-amber-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Remove from My Library"
                          >
                            <BookmarkCheck className="w-4 h-4 fill-amber-400" />
                          </button>
                        </div>

                        {/* Title */}
                        <h4 className="font-cinzel text-base font-bold text-white leading-snug line-clamp-2">
                          {teaching.title}
                        </h4>

                        {/* Subtitle */}
                        <p className="text-xs text-slate-400 font-editorial italic mt-1 line-clamp-2">
                          "{teaching.subtitle}"
                        </p>

                        {/* Metadata row */}
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span className="capitalize">{teaching.format}</span>
                          <span aria-hidden="true">·</span>
                          <span>{teaching.duration}</span>
                          <span aria-hidden="true">·</span>
                          <span>{teaching.scriptures[0]}</span>
                        </div>

                        {/* Offline Study Ready Badge */}
                        <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-[10px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>Full Study & Notes Offline</span>
                        </div>
                      </div>

                      {/* Actions Strip */}
                      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        {teaching.format === 'audio' && (
                          <button
                            onClick={() => onPlayAudio(teaching)}
                            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                              isPlaying
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                            }`}
                          >
                            <Headphones className="w-3.5 h-3.5" />
                            <span>{isPlaying ? 'Playing Sermon' : 'Play Audio'}</span>
                          </button>
                        )}

                        {teaching.format === 'video' && (
                          <button
                            onClick={() => onOpenVideo(teaching)}
                            className="flex-1 py-1.5 px-3 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>{isOnline ? 'Watch Session' : 'View Session Outline'}</span>
                          </button>
                        )}

                        {teaching.format === 'pdf' && (
                          <button
                            onClick={() => onOpenPdf(teaching)}
                            className="flex-1 py-1.5 px-3 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Read Monograph</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDownloadTeaching(teaching)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                          title="Download Study Notes (Offline text file)"
                        >
                          {downloadSuccess[teaching.id] ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Saved Books Section */}
          {(filter === 'all' || filter === 'books') && savedBooks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Saved Books for Sale ({savedBooks.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex flex-col justify-between rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-600/40 p-5 shadow-lg relative"
                  >
                    <div>
                      {/* Top cover preview with offline badge */}
                      <div className="relative rounded-lg overflow-hidden border border-slate-700/60 mb-3 bg-black aspect-[3/4] flex items-center justify-center">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-semibold text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shadow">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Offline Chapters Cached
                        </span>
                        <button
                          onClick={() => onToggleBookBookmark(book.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-amber-400 hover:text-rose-400 border border-slate-700 transition-colors shadow"
                          title="Remove from My Library"
                        >
                          <BookmarkCheck className="w-4 h-4 fill-amber-400" />
                        </button>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">{book.price}</span>
                        {book.courierFee && (
                          <span className="text-[10px] text-slate-500 font-mono">{book.courierFee}</span>
                        )}
                      </div>

                      <h4 className="font-cinzel text-base font-bold text-white mt-1 leading-snug">
                        {book.title}
                      </h4>

                      <p className="text-xs text-slate-400 font-editorial italic mt-1 line-clamp-2">
                        "{book.subtitle}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                      {book.onlinePurchaseUrl && (
                        <a
                          href={book.onlinePurchaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow ${!isOnline ? 'opacity-70' : ''}`}
                          onClick={(e) => {
                            if (!isOnline) {
                              e.preventDefault();
                              onShowToast('External bookstore purchase requires internet. Sample chapters and study notes are saved offline on your device.');
                            }
                          }}
                        >
                          <span>Buy Online (Books2Read)</span>
                          <span className="text-[10px]">{isOnline ? '↗' : '(Online)'}</span>
                        </a>
                      )}

                      {(book.price.startsWith('R') || book.courierFee) && (
                        <button
                          onClick={() => onOrderBook(book)}
                          className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Order Print Copy ({book.price})</span>
                        </button>
                      )}

                      <button
                        onClick={() => onReadBook(book)}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-700/80 hover:border-amber-500/40"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>Read Sample Chapters (Offline Ready)</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. My Prayer Journal Section */}
          {(filter === 'all' || filter === 'journal') && (
            <div className={filter === 'all' ? 'pt-10 border-t border-slate-800' : ''}>
              <PrayerJournalView
                entries={journalEntries}
                onAddEntry={onAddJournalEntry}
                onUpdateEntry={onUpdateJournalEntry}
                onDeleteEntry={onDeleteJournalEntry}
                onShowToast={onShowToast}
              />
            </div>
          )}

        </div>
      )}

    </section>
  );
};
