import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TeachingsSection } from './components/TeachingsSection';
import { BooksSection } from './components/BooksSection';
import { ReportsSection } from './components/ReportsSection';
import { ItinerarySection } from './components/ItinerarySection';
import { ReformationDiagnostic } from './components/ReformationDiagnostic';
import { MyLibrarySection } from './components/MyLibrarySection';
import { NotificationModal } from './components/NotificationModal';
import { LiveBroadcastModal } from './components/LiveBroadcastModal';
import { EBookReaderModal } from './components/EBookReaderModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PdfReaderModal } from './components/PdfReaderModal';
import { StickyAudioPlayer } from './components/StickyAudioPlayer';
import { AdminDashboard } from './components/AdminDashboard';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { WhatsAppWidget, WHATSAPP_NUMBER } from './components/WhatsAppWidget';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';
import { offlineCacheService } from './services/offlineCacheService';
import {
  Teaching,
  Book,
  ItineraryEvent,
  NotificationItem,
  BookmarkStore,
  MinisterialReport,
  BookOrder,
  PrayerPetition,
  UserProfile,
  JournalEntry,
  getStoredTeachings,
  saveTeachings,
  getStoredBooks,
  saveBooks,
  getStoredItinerary,
  saveItinerary,
  getStoredNotifications,
  saveNotifications,
  getStoredBookmarks,
  saveBookmarks,
  getStoredReports,
  saveReports,
  getStoredOrders,
  saveOrders,
  getStoredPetitions,
  savePetitions,
  getStoredJournalEntries,
  saveJournalEntries,
  YOUTUBE_CHANNEL_URL,
} from './data/smartData';
import { soundEffects } from './services/soundEffects';
import { googleAuthService } from './services/googleAuth';
import { notificationService } from './services/notificationService';
import { Bookmark, ShoppingBag, Truck, Check, MessageCircle, Cloud, Send } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core Data States
  const [teachings, setTeachings] = useState<Teaching[]>(getStoredTeachings);
  const [books, setBooks] = useState<Book[]>(getStoredBooks);
  const [itinerary, setItinerary] = useState<ItineraryEvent[]>(getStoredItinerary);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
  const [bookmarks, setBookmarks] = useState<BookmarkStore>(getStoredBookmarks);
  const [reports, setReports] = useState<MinisterialReport[]>(getStoredReports);
  const [orders, setOrders] = useState<BookOrder[]>(getStoredOrders);
  const [petitions, setPetitions] = useState<PrayerPetition[]>(getStoredPetitions);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(getStoredJournalEntries);

  // User Profile & Google Backed Up State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(googleAuthService.getCurrentUser());

  // Active Media States
  const [activeAudioTeaching, setActiveAudioTeaching] = useState<Teaching | null>(null);
  const [selectedVideoTeaching, setSelectedVideoTeaching] = useState<Teaching | null>(null);
  const [selectedPdfTeaching, setSelectedPdfTeaching] = useState<Teaching | null>(null);
  const [selectedReaderBook, setSelectedReaderBook] = useState<Book | null>(null);

  // Modal Dialog States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLiveBroadcastOpen, setIsLiveBroadcastOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Order Book Modal State
  const [orderingBook, setOrderingBook] = useState<Book | null>(null);
  const [orderName, setOrderName] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'paxi'>('courier');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<BookOrder | null>(null);

  // Subscribe to Google Auth changes
  useEffect(() => {
    const unsubscribe = googleAuthService.subscribe((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Pre-fill user details if logged into Google
  useEffect(() => {
    if (currentUser) {
      if (!orderName) setOrderName(currentUser.name);
      if (!orderEmail) setOrderEmail(currentUser.email);
    }
  }, [currentUser]);

  // Saved items arrays for MyLibrarySection & PWA Offline Caching
  const savedTeachings = teachings.filter((t) => bookmarks.teachingIds.includes(t.id));
  const savedBooks = books.filter((b) => bookmarks.bookIds.includes(b.id));
  const totalSavedCount = savedTeachings.length + savedBooks.length + journalEntries.length;

  // Persistence triggers
  useEffect(() => {
    saveTeachings(teachings);
  }, [teachings]);

  useEffect(() => {
    saveBooks(books);
  }, [books]);

  useEffect(() => {
    saveItinerary(itinerary);
  }, [itinerary]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveBookmarks(bookmarks);
    // Keep PWA offline cache primed for bookmarked resources
    offlineCacheService.precacheAllLibraryItems(savedTeachings, savedBooks, journalEntries);
    // Cloud sync to Google user if authenticated
    if (currentUser) {
      googleAuthService.backupUserData(bookmarks, orders, petitions, journalEntries);
    }
  }, [bookmarks, currentUser, journalEntries, savedTeachings, savedBooks]);

  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  useEffect(() => {
    saveOrders(orders);
    if (currentUser) {
      googleAuthService.backupUserData(bookmarks, orders, petitions, journalEntries);
    }
  }, [orders, currentUser, journalEntries]);

  useEffect(() => {
    savePetitions(petitions);
    if (currentUser) {
      googleAuthService.backupUserData(bookmarks, orders, petitions, journalEntries);
    }
  }, [petitions, currentUser, journalEntries]);

  useEffect(() => {
    saveJournalEntries(journalEntries);
    if (currentUser) {
      googleAuthService.backupUserData(bookmarks, orders, petitions, journalEntries);
    }
  }, [journalEntries, currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Bookmark toggling logic
  const handleToggleTeachingBookmark = (id: string) => {
    const isBookmarked = bookmarks.teachingIds.includes(id);
    let updated: string[];
    if (isBookmarked) {
      updated = bookmarks.teachingIds.filter((item) => item !== id);
      showToast('Removed teaching from My Library');
    } else {
      updated = [...bookmarks.teachingIds, id];
      soundEffects.playAlertChime();
      showToast('Saved teaching to My Library! 📖');
    }
    setBookmarks((prev) => ({ ...prev, teachingIds: updated }));
  };

  const handleToggleBookBookmark = (id: string) => {
    const isBookmarked = bookmarks.bookIds.includes(id);
    let updated: string[];
    if (isBookmarked) {
      updated = bookmarks.bookIds.filter((item) => item !== id);
      showToast('Removed book from My Library');
    } else {
      updated = [...bookmarks.bookIds, id];
      soundEffects.playAlertChime();
      showToast('Saved book to My Library! 📚');
    }
    setBookmarks((prev) => ({ ...prev, bookIds: updated }));
  };

  const handleClearLibrary = () => {
    setBookmarks({ teachingIds: [], bookIds: [] });
    showToast('My Library bookmarks have been cleared.');
  };

  // Prayer Journal Handlers
  const handleAddJournalEntry = (newEntry: JournalEntry) => {
    setJournalEntries((prev) => [newEntry, ...prev]);
    soundEffects.playAlertChime();
    showToast(`Prayer note saved: "${newEntry.title}"`);
  };

  const handleUpdateJournalEntry = (updatedEntry: JournalEntry) => {
    setJournalEntries((prev) => prev.map((j) => (j.id === updatedEntry.id ? updatedEntry : j)));
    showToast(`Journal entry "${updatedEntry.title}" updated.`);
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
    showToast('Journal entry deleted.');
  };

  // Handlers for Admin Backend Actions
  const handleAddTeaching = (newTeaching: Teaching) => {
    setTeachings((prev) => [newTeaching, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `🎙️ New Teaching: ${newTeaching.title}`,
      message: `Apostle Nicholas Dlamini uploaded a new ${newTeaching.format.toUpperCase()} resource: "${newTeaching.subtitle}".`,
      timestamp: 'Just now',
      type: 'teaching',
      read: false,
      targetTab: 'teachings',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Teaching "${newTeaching.title}" posted successfully!`);
  };

  const handleUpdateTeaching = (updatedTeaching: Teaching) => {
    setTeachings((prev) => prev.map((t) => (t.id === updatedTeaching.id ? updatedTeaching : t)));
    showToast(`Teaching "${updatedTeaching.title}" updated successfully!`);
  };

  const handleDeleteTeaching = (id: string) => {
    setTeachings((prev) => prev.filter((t) => t.id !== id));
    showToast('Teaching removed from vault.');
  };

  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `📚 Book Announcement: ${newBook.title}`,
      message: `Nicholas Dlamini released "${newBook.title} - ${newBook.subtitle}" (${newBook.price}). Order copies now.`,
      timestamp: 'Just now',
      type: 'book',
      read: false,
      targetTab: 'books',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Book "${newBook.title}" registered in library!`);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    showToast(`Book "${updatedBook.title}" updated.`);
  };

  const handleAddItinerary = (newEvent: ItineraryEvent) => {
    setItinerary((prev) => [newEvent, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `✈️ Whereabouts Update: ${newEvent.city}`,
      message: `Apostle Nicholas Dlamini ministering at ${newEvent.hostMinistry} in ${newEvent.city}, ${newEvent.country}.`,
      timestamp: 'Just now',
      type: 'itinerary',
      read: false,
      targetTab: 'itinerary',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Ministerial whereabouts in ${newEvent.city} announced!`);
  };

  const handleAddReport = (newReport: MinisterialReport) => {
    setReports((prev) => [newReport, ...prev]);
    showToast(`Ministerial report "${newReport.title}" published!`);
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    showToast('Report deleted.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: BookOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    showToast(`Order status updated to ${status}.`);
  };

  const handleMarkPetitionPrayed = (petitionId: string, note?: string) => {
    setPetitions((prev) =>
      prev.map((p) => (p.id === petitionId ? { ...p, prayedOver: true, ministerNote: note || p.ministerNote } : p))
    );
    showToast('Petition marked as prayed over at the apostolic altar.');
  };

  const handleAddPetitionFromUser = (newPetition: PrayerPetition) => {
    setPetitions((prev) => [newPetition, ...prev]);
    showToast('Your prayer petition has been received and covered in faith!');
  };

  const handleBroadcastNotification = (newItem: NotificationItem) => {
    setNotifications((prev) => [newItem, ...prev]);
    notificationService.sendNativeNotification(newItem);
    showToast(`🚨 Broadcast transmitted: "${newItem.title}"`);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleRsvpSuccess = (eventId: string, guestName: string) => {
    setItinerary((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, rsvpCount: e.rsvpCount + 1 } : e))
    );
    showToast(`Seat registration confirmed for ${guestName}!`);
  };

  const handleSyncNotificationReminder = (event: ItineraryEvent) => {
    const isCurrentlySynced = !!event.reminderSynced;
    const newSyncedState = !isCurrentlySynced;
    
    setItinerary((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, reminderSynced: newSyncedState } : e))
    );

    if (newSyncedState) {
      soundEffects.playAlertChime();
      const eventNotif: NotificationItem = {
        id: `notif-event-${event.id}-${Date.now()}`,
        title: `📅 Live Alert: ${event.city} Gathering`,
        message: `You are set to receive notifications for "${event.title}" (${event.dateRange} at ${event.venue || event.hostMinistry}). Live stream on YouTube: Intense Word Sessions.`,
        timestamp: 'Just now',
        type: 'live',
        read: false,
        targetTab: 'itinerary',
      };
      setNotifications((prev) => [eventNotif, ...prev]);
      notificationService.sendNativeNotification(eventNotif);
      showToast(`Event reminder synced for ${event.city}! You'll be notified when live.`);
    } else {
      showToast(`Reminder removed for ${event.city}.`);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingBook) return;

    soundEffects.playAlertChime();
    const newOrder: BookOrder = {
      id: `ord-${Date.now()}`,
      bookId: orderingBook.id,
      bookTitle: orderingBook.title,
      bookPrice: orderingBook.price,
      customerName: orderName,
      customerEmail: orderEmail,
      customerPhone: orderPhone,
      deliveryMethod,
      deliveryAddress: orderAddress,
      timestamp: 'Just now',
      status: 'Pending Review'
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setOrderSuccess(true);

    const orderNotif: NotificationItem = {
      id: `notif-ord-${Date.now()}`,
      title: `📦 Book Order Placed: ${orderingBook.title}`,
      message: `${orderName} ordered a physical copy. Dispatch via ${deliveryMethod.toUpperCase()}.`,
      timestamp: 'Just now',
      type: 'book',
      read: false,
      targetTab: 'books'
    };
    setNotifications((prev) => [orderNotif, ...prev]);
    notificationService.sendNativeNotification(orderNotif);
  };

  const handleCloseOrderModal = () => {
    setOrderSuccess(false);
    setLastPlacedOrder(null);
    setOrderingBook(null);
    setOrderAddress('');
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-gradient-to-r from-amber-950 to-slate-900 border border-amber-500/80 p-4 rounded-xl shadow-2xl shadow-black/80 animate-bounce text-xs flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
          <span className="text-slate-100 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        savedBookmarksCount={totalSavedCount}
        currentUser={currentUser}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSubscribe={() => setIsNotificationOpen(true)}
        onOpenGoogleAuth={() => setIsGoogleModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <>
            <HeroSection
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenLive={() => setIsLiveBroadcastOpen(true)}
              onOpenSubscribe={() => setIsNotificationOpen(true)}
              savedCount={totalSavedCount}
            />

            {/* Personalized My Library Strip on Main Page */}
            {totalSavedCount > 0 && (
              <div className="border-t border-slate-800/80 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-amber-600/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Bookmark className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-cinzel text-base font-bold text-white">
                          Your Personalized 'My Library' has {totalSavedCount} saved item{totalSavedCount > 1 ? 's' : ''}
                        </h4>
                        {currentUser && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center gap-1">
                            <Cloud className="w-3 h-3" />
                            <span>Backed up to Google</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {savedTeachings.length} saved teachings, {savedBooks.length} saved books, and {journalEntries.length} prayer journal entries ready for study and devotion.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveTab('library');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow"
                    >
                      <span>Open My Library ({totalSavedCount})</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Books for Sale Section by Nicholas Dlamini */}
            <div className="border-t border-slate-800/80">
              <BooksSection
                books={books}
                bookmarkedIds={bookmarks.bookIds}
                onReadBook={(b) => setSelectedReaderBook(b)}
                onOrderBook={(b) => setOrderingBook(b)}
                onToggleBookmark={handleToggleBookBookmark}
              />
            </div>

            {/* Featured Ministerial Reports Preview on Overview */}
            <div className="border-t border-slate-800/80 bg-slate-950/60 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-600/30">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">
                    Latest Revival Dispatch
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-white">
                    {reports[0]?.title || 'Apostolic Field Reports & Dispatches'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl line-clamp-2">
                    {reports[0]?.summary || 'Read verified reports on fire altars restored, leadership realignments, and building project updates.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('reports');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors whitespace-nowrap shrink-0"
                >
                  Read All Reports & Petitions →
                </button>
              </div>
            </div>

            {/* Teachings Section with Bookmarking */}
            <div className="border-t border-slate-800/80 bg-slate-950/40">
              <TeachingsSection
                teachings={teachings.slice(0, 3)}
                activeAudioId={activeAudioTeaching?.id || null}
                bookmarkedIds={bookmarks.teachingIds}
                onPlayAudio={(t) => setActiveAudioTeaching(t)}
                onOpenVideo={(t) => setSelectedVideoTeaching(t)}
                onOpenPdf={(t) => setSelectedPdfTeaching(t)}
                onToggleBookmark={handleToggleTeachingBookmark}
              />
              <div className="text-center pb-12">
                <button
                  onClick={() => {
                    setActiveTab('teachings');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-semibold rounded-lg border border-amber-800/40 transition-colors"
                >
                  View All {teachings.length} Audio, Video & PDF Teachings →
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'reports' && (
          <ReportsSection
            reports={reports}
            onSubmitPetition={handleAddPetitionFromUser}
            onOpenNotifications={() => setIsNotificationOpen(true)}
          />
        )}

        {activeTab === 'library' && (
          <MyLibrarySection
            savedTeachings={savedTeachings}
            savedBooks={savedBooks}
            journalEntries={journalEntries}
            activeAudioId={activeAudioTeaching?.id || null}
            onPlayAudio={(t) => setActiveAudioTeaching(t)}
            onOpenVideo={(t) => setSelectedVideoTeaching(t)}
            onOpenPdf={(t) => setSelectedPdfTeaching(t)}
            onReadBook={(b) => setSelectedReaderBook(b)}
            onOrderBook={(b) => setOrderingBook(b)}
            onToggleTeachingBookmark={handleToggleTeachingBookmark}
            onToggleBookBookmark={handleToggleBookBookmark}
            onAddJournalEntry={handleAddJournalEntry}
            onUpdateJournalEntry={handleUpdateJournalEntry}
            onDeleteJournalEntry={handleDeleteJournalEntry}
            onShowToast={showToast}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onClearLibrary={handleClearLibrary}
          />
        )}

        {activeTab === 'teachings' && (
          <TeachingsSection
            teachings={teachings}
            activeAudioId={activeAudioTeaching?.id || null}
            bookmarkedIds={bookmarks.teachingIds}
            onPlayAudio={(t) => setActiveAudioTeaching(t)}
            onOpenVideo={(t) => setSelectedVideoTeaching(t)}
            onOpenPdf={(t) => setSelectedPdfTeaching(t)}
            onToggleBookmark={handleToggleTeachingBookmark}
          />
        )}

        {activeTab === 'books' && (
          <BooksSection
            books={books}
            bookmarkedIds={bookmarks.bookIds}
            onReadBook={(b) => setSelectedReaderBook(b)}
            onOrderBook={(b) => setOrderingBook(b)}
            onToggleBookmark={handleToggleBookBookmark}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItinerarySection
            itinerary={itinerary}
            onOpenLive={() => setIsLiveBroadcastOpen(true)}
            onRsvpSuccess={handleRsvpSuccess}
            onSyncNotificationReminder={handleSyncNotificationReminder}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'diagnostic' && (
          <ReformationDiagnostic
            onNavigateToTeaching={(cat) => {
              setActiveTab('teachings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToBook={() => {
              setActiveTab('books');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Persistent Sticky Audio Player */}
      {activeAudioTeaching && (
        <StickyAudioPlayer
          teaching={activeAudioTeaching}
          onClose={() => setActiveAudioTeaching(null)}
        />
      )}

      {/* Notification Center Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Live Broadcast Room Modal */}
      <LiveBroadcastModal
        isOpen={isLiveBroadcastOpen}
        onClose={() => setIsLiveBroadcastOpen(false)}
      />

      {/* Interactive In-App eBook Reader Modal */}
      <EBookReaderModal
        book={selectedReaderBook}
        onClose={() => setSelectedReaderBook(null)}
      />

      {/* Video Masterclass Player Modal */}
      <VideoPlayerModal
        teaching={selectedVideoTeaching}
        onClose={() => setSelectedVideoTeaching(null)}
      />

      {/* PDF & Monograph Reader Modal */}
      <PdfReaderModal
        teaching={selectedPdfTeaching}
        onClose={() => setSelectedPdfTeaching(null)}
      />

      {/* Google Sign In & Account Backup Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        bookmarks={bookmarks}
        orders={orders}
        petitions={petitions}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onShowToast={showToast}
      />

      {/* Admin Backend / Master Control Panel */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        teachings={teachings}
        books={books}
        itinerary={itinerary}
        notifications={notifications}
        reports={reports}
        orders={orders}
        petitions={petitions}
        onAddTeaching={handleAddTeaching}
        onUpdateTeaching={handleUpdateTeaching}
        onDeleteTeaching={handleDeleteTeaching}
        onAddBook={handleAddBook}
        onUpdateBook={handleUpdateBook}
        onAddItinerary={handleAddItinerary}
        onAddReport={handleAddReport}
        onDeleteReport={handleDeleteReport}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onMarkPetitionPrayed={handleMarkPetitionPrayed}
        onBroadcastNotification={handleBroadcastNotification}
        onShowToast={showToast}
      />

      {/* Book Ordering / Delivery Modal */}
      {orderingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
              <img
                src={orderingBook.coverImage}
                alt={orderingBook.title}
                className="w-16 h-20 rounded object-cover border border-amber-600/40 shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">
                  Book Order Request
                </span>
                <h3 className="font-cinzel text-lg font-bold text-white leading-tight">
                  {orderingBook.title}
                </h3>
                <p className="text-xs text-amber-300 font-mono mt-0.5">
                  Price: {orderingBook.price} {orderingBook.courierFee && `(${orderingBook.courierFee})`}
                </p>
                {orderingBook.churchBuildingSupport && (
                  <p className="text-[11px] text-amber-200 mt-1 italic">
                    ★ Proceeds support our church building project.
                  </p>
                )}
              </div>
            </div>

            {orderSuccess && lastPlacedOrder ? (
              <div className="my-6 p-6 text-center bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs space-y-4 animate-fadeIn">
                <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-white">Order Received & Logged!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Thank you for ordering <em>"{orderingBook.title}"</em>. Order reference: #{lastPlacedOrder.id}.
                  </p>
                </div>

                {/* Instant WhatsApp Confirmation Button */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-600/40 space-y-2">
                  <p className="text-slate-300 text-[11px]">
                    To expedite immediate courier dispatch, tap below to send your delivery details directly to Apostle Nicholas Dlamini on WhatsApp:
                  </p>
                  <a
                    href={`https://wa.me/26879309372?text=${encodeURIComponent(
                      `Shalom Apostle Nicholas Dlamini, I have just placed an order for "${orderingBook.title}" (${orderingBook.price}).\nOrder ID: #${lastPlacedOrder.id}\nName: ${lastPlacedOrder.customerName}\nPhone: ${lastPlacedOrder.customerPhone}\nDelivery: ${lastPlacedOrder.deliveryMethod.toUpperCase()} to ${lastPlacedOrder.deliveryAddress}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Order Proof on WhatsApp ({WHATSAPP_NUMBER})</span>
                  </a>
                </div>

                <button
                  onClick={handleCloseOrderModal}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pastor David Khumalo"
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number (Call / WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+268 76... or +27 82..."
                      value={orderPhone}
                      onChange={(e) => setOrderPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="leader@ministry.org"
                    value={orderEmail}
                    onChange={(e) => setOrderEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Delivery Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('courier')}
                      className={`p-2.5 rounded-lg text-xs border text-left flex items-center gap-2 ${
                        deliveryMethod === 'courier'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Door Courier (+R60)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('paxi')}
                      className={`p-2.5 rounded-lg text-xs border text-left flex items-center gap-2 ${
                        deliveryMethod === 'paxi'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>PEP Paxi Counter (+R60)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {deliveryMethod === 'paxi'
                      ? 'Nearest PEP Store Code or Location'
                      : 'Physical Street Delivery Address & City'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder={
                      deliveryMethod === 'paxi'
                        ? 'e.g. PEP Store Sandton City, Johannesburg'
                        : 'e.g. 14 Church Street, Mbabane / Pretoria Central'
                    }
                    value={orderAddress}
                    onChange={(e) => setOrderAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderingBook(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Confirm Order ({orderingBook.price})</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Offline Status Banner */}
      <OfflineIndicator
        onNavigateToLibrary={() => {
          setActiveTab('library');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating WhatsApp Action Widget (+268 7930 9372) */}
      <WhatsAppWidget />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSubscribe={() => setIsNotificationOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

    </div>
  );
}
