import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Radio,
  BookOpen,
  FileText,
  Headphones,
  Video,
  MapPin,
  Send,
  Check,
  Bell,
  ShoppingBag,
  Heart,
  Users,
  ExternalLink,
  MessageCircle,
  Truck,
  Plus,
  Trash2,
  Lock,
  Eye,
  Flame,
  Globe,
  Play,
  Link as LinkIcon,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Upload,
  Maximize2,
  FileImage,
  Layers,
  Sparkle,
  Sparkles
} from 'lucide-react';
import {
  Teaching,
  Book,
  ItineraryEvent,
  NotificationItem,
  MinisterialReport,
  BookOrder,
  PrayerPetition,
  UserProfile,
  extractYouTubeVideoId,
  MINISTRY_POSTER_PRESETS,
  PosterPreset
} from '../data/smartData';
import { VideoPlayerModal } from './VideoPlayerModal';
import { notificationService } from '../services/notificationService';
import { soundEffects } from '../services/soundEffects';
import { WHATSAPP_NUMBER, FACEBOOK_URL } from './WhatsAppWidget';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  teachings: Teaching[];
  books: Book[];
  itinerary: ItineraryEvent[];
  notifications: NotificationItem[];
  reports: MinisterialReport[];
  orders: BookOrder[];
  petitions: PrayerPetition[];
  onAddTeaching: (teaching: Teaching) => void;
  onUpdateTeaching?: (teaching: Teaching) => void;
  onDeleteTeaching: (id: string) => void;
  onAddBook: (book: Book) => void;
  onUpdateBook: (book: Book) => void;
  onAddItinerary: (event: ItineraryEvent) => void;
  onAddReport: (report: MinisterialReport) => void;
  onDeleteReport: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: BookOrder['status']) => void;
  onMarkPetitionPrayed: (petitionId: string, note?: string) => void;
  onBroadcastNotification: (item: NotificationItem) => void;
  onShowToast: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  currentUser,
  teachings,
  books,
  itinerary,
  notifications,
  reports,
  orders,
  petitions,
  onAddTeaching,
  onUpdateTeaching,
  onDeleteTeaching,
  onAddBook,
  onUpdateBook,
  onAddItinerary,
  onAddReport,
  onDeleteReport,
  onUpdateOrderStatus,
  onMarkPetitionPrayed,
  onBroadcastNotification,
  onShowToast
}) => {
  // Passcode gate (defaults to unlocked if logged in as admin)
  const isAutoUnlocked = currentUser?.isAdmin || currentUser?.email === 'okuhlestatscom@gmail.com';
  const [isAuthenticated, setIsAuthenticated] = useState(isAutoUnlocked);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'reports' | 'broadcast' | 'orders' | 'teachings' | 'books' | 'petitions' | 'itinerary'
  >('overview');

  // 1. Report Form State
  const [repTitle, setRepTitle] = useState('');
  const [repCategory, setRepCategory] = useState<MinisterialReport['category']>('Revival Dispatch');
  const [repSummary, setRepSummary] = useState('');
  const [repContent, setRepContent] = useState('');
  const [repLocation, setRepLocation] = useState('Eswatini & Regional Hub');
  const [repNotifyFollowers, setRepNotifyFollowers] = useState(true);

  // 1b. Report Poster Attachment
  const [repImageUrl, setRepImageUrl] = useState<string>('');

  // 2. Broadcast Push Notification State (with Poster & Cover Upload)
  const [bcTitle, setBcTitle] = useState('🚨 LIVE APOSTOLIC IMPARTATION TONIGHT');
  const [bcMessage, setBcMessage] = useState('Apostle Nicholas Dlamini is ministering live. Connect now via Facebook / Web stream.');
  const [bcTargetTab, setBcTargetTab] = useState('overview');
  const [bcUrgent, setBcUrgent] = useState(true);
  const [bcType, setBcType] = useState<NotificationItem['type']>('live');
  const [bcImageUrl, setBcImageUrl] = useState<string>('/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg');
  const [bcImageCaption, setBcImageCaption] = useState<string>('Apostle Nicholas Dlamini — Live Apostolic Impartation Flyer');
  const [bcActionLabel, setBcActionLabel] = useState<string>('Watch Live');
  const [bcPosterMode, setBcPosterMode] = useState<'upload' | 'preset' | 'url'>('preset');
  const [isDragOverPoster, setIsDragOverPoster] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // New Book Registration State with Cover Upload
  const [isRegisteringBook, setIsRegisteringBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSubtitle, setNewBookSubtitle] = useState('');
  const [newBookPrice, setNewBookPrice] = useState('R350');
  const [newBookCourier, setNewBookCourier] = useState('plus R60 courier fee');
  const [newBookType, setNewBookType] = useState<Book['type']>('Paperback');
  const [newBookCover, setNewBookCover] = useState<string>('/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg');
  const [newBookSynopsis, setNewBookSynopsis] = useState('');
  const [newBookB2RUrl, setNewBookB2RUrl] = useState('');
  const [newBookNotify, setNewBookNotify] = useState(true);
  const bookCoverInputRef = React.useRef<HTMLInputElement | null>(null);

  // 3. Teaching Form State (YouTube, Audio, PDF)
  const [teachTitle, setTeachTitle] = useState('');
  const [teachSubtitle, setTeachSubtitle] = useState('');
  const [teachFormat, setTeachFormat] = useState<'audio' | 'video' | 'pdf'>('video');
  const [teachCategory, setTeachCategory] = useState<Teaching['category']>('Apostolic Order');
  const [teachScriptures, setTeachScriptures] = useState('1 Corinthians 3:10, Ephesians 4:11-12');
  const [teachDescription, setTeachDescription] = useState('');
  const [teachYoutubeUrl, setTeachYoutubeUrl] = useState('');
  const [teachAudioUrl, setTeachAudioUrl] = useState('');
  const [teachDuration, setTeachDuration] = useState('');
  const [teachChapters, setTeachChapters] = useState('00:00 Opening & Foundation, 18:30 Sound Doctrine, 45:00 Altar Fire');

  // Editing existing teaching state
  const [editingTeaching, setEditingTeaching] = useState<Teaching | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editFormat, setEditFormat] = useState<'audio' | 'video' | 'pdf'>('video');
  const [editCategory, setEditCategory] = useState<Teaching['category']>('Apostolic Order');
  const [editDuration, setEditDuration] = useState('');
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('');
  const [editAudioUrl, setEditAudioUrl] = useState('');
  const [editChapters, setEditChapters] = useState('');
  const [editScriptures, setEditScriptures] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Video preview player inside admin
  const [previewTeaching, setPreviewTeaching] = useState<Teaching | null>(null);

  // 4. Itinerary Form State
  const [itCity, setItCity] = useState('');
  const [itCountry, setItCountry] = useState('Eswatini');
  const [itTitle, setItTitle] = useState('');
  const [itVenue, setItVenue] = useState('');
  const [itHost, setItHost] = useState('');
  const [itDates, setItDates] = useState('');

  if (!isOpen) return null;

  // Authentication check
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'smart2026' || passcode === 'apostle78' || passcode === '1234') {
      setIsAuthenticated(true);
      setAuthError(false);
      soundEffects.playAlertChime();
      onShowToast('Welcome Apostle Nicholas Dlamini — Admin Control Unlocked');
    } else {
      setAuthError(true);
    }
  };

  const handleInstantApostleUnlock = () => {
    setIsAuthenticated(true);
    soundEffects.playAlertChime();
    onShowToast('Apostle Nicholas Dlamini authenticated successfully');
  };

  // Submit new report
  const handlePublishReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repTitle || !repSummary) return;

    const newReport: MinisterialReport = {
      id: `rep-${Date.now()}`,
      title: repTitle,
      category: repCategory,
      summary: repSummary,
      content: repContent.split('\n\n').filter(Boolean).length > 0
        ? repContent.split('\n\n').filter(Boolean)
        : [repSummary],
      author: 'Apostle Nicholas Dlamini',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      location: repLocation,
      isFeatured: true
    };

    onAddReport(newReport);

    if (repNotifyFollowers) {
      const notifItem: NotificationItem = {
        id: `notif-rep-${Date.now()}`,
        title: `📜 New Ministerial Report: ${newReport.title}`,
        message: newReport.summary,
        timestamp: 'Just now',
        type: 'report',
        read: false,
        targetTab: 'overview'
      };
      onBroadcastNotification(notifItem);
      notificationService.sendNativeNotification(notifItem);
    }

    setRepTitle('');
    setRepSummary('');
    setRepContent('');
    onShowToast(`Ministerial report "${newReport.title}" published!`);
  };

  // Broadcast push notification with poster/cover upload support
  const handlePosterFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setBcImageUrl(dataUrl);
        setBcImageCaption(file.name.replace(/\.[^/.]+$/, ''));
        onShowToast(`Poster "${file.name}" attached successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBookCoverFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setNewBookCover(dataUrl);
        onShowToast(`New book cover "${file.name}" uploaded!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle || !bcMessage) return;

    soundEffects.playAlertChime();
    const notifItem: NotificationItem = {
      id: `bc-${Date.now()}`,
      title: bcTitle,
      message: bcMessage,
      timestamp: 'Just now',
      type: bcType,
      urgent: bcUrgent,
      read: false,
      targetTab: bcTargetTab,
      imageUrl: bcImageUrl ? bcImageUrl : undefined,
      imageCaption: bcImageCaption ? bcImageCaption : undefined,
      actionLabel: bcActionLabel ? bcActionLabel : undefined
    };

    onBroadcastNotification(notifItem);
    notificationService.sendNativeNotification(notifItem);
    onShowToast(`🚨 Push notification published with ${bcImageUrl ? 'attached poster' : 'instant alert'}!`);
  };

  const handleCreateBookWithCover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle || !newBookPrice) return;

    soundEffects.playAlertChime();
    const newBook: Book = {
      id: `b-${Date.now()}`,
      title: newBookTitle,
      subtitle: newBookSubtitle || 'Sound Ministry and Reformation Tools Series',
      author: 'Nicholas Dlamini',
      coverImage: newBookCover || '/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg',
      type: newBookType,
      publishYear: `${new Date().getFullYear()}`,
      pages: 240,
      price: newBookPrice,
      courierFee: newBookCourier,
      foreword: 'Apostolic Oversight Secretariat',
      publisher: 'ND Publishers',
      onlinePurchaseUrl: newBookB2RUrl || undefined,
      synopsis: newBookSynopsis || `Equipping fivefold leaders with sound doctrine and apostolic wisdom by Apostle Nicholas Dlamini.`,
      keyTakeaways: [
        'Biblical alignment that eliminates delays in ministry.',
        'Spiritual discernment and sound doctrine foundations.',
        'Practical guidance for church architects and revival pioneers.'
      ],
      sampleChapters: [
        {
          number: 1,
          title: 'Foundational Truths for Kingdom Pioneers',
          text: [
            'Every generational movement must build on biblical foundations.',
            'Apostle Nicholas Dlamini expounds on the strategies that withstand trial.'
          ]
        }
      ],
      isBestseller: true
    };

    onAddBook(newBook);

    if (newBookNotify) {
      const bookNotif: NotificationItem = {
        id: `notif-book-${Date.now()}`,
        title: `📚 New Book Release: ${newBook.title}`,
        message: `Apostle Nicholas Dlamini published "${newBook.title}". Physical copies available (${newBook.price} ${newBook.courierFee || ''}) or global eBook.`,
        timestamp: 'Just now',
        type: 'book',
        read: false,
        targetTab: 'books',
        imageUrl: newBook.coverImage,
        imageCaption: `${newBook.title} — Official Cover Flyer (${newBook.price})`,
        actionLabel: 'Order Copy Now'
      };
      onBroadcastNotification(bookNotif);
      notificationService.sendNativeNotification(bookNotif);
    }

    setNewBookTitle('');
    setNewBookSubtitle('');
    setNewBookSynopsis('');
    setNewBookB2RUrl('');
    setIsRegisteringBook(false);
    onShowToast(`Book "${newBook.title}" registered in bookstore!`);
  };

  // Submit teaching with YouTube and audio support
  const handleCreateTeaching = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teachTitle) return;

    const ytId = extractYouTubeVideoId(teachYoutubeUrl);
    const parsedChapters = teachChapters
      ? teachChapters
          .split(',')
          .map((entry) => {
            const parts = entry.trim().split(/\s+(.+)/);
            if (parts.length >= 2) {
              return { time: parts[0].trim(), label: parts[1].trim() };
            }
            return null;
          })
          .filter((t): t is { time: string; label: string } => t !== null)
      : [];

    const newTeaching: Teaching = {
      id: `t-${Date.now()}`,
      title: teachTitle,
      subtitle: teachSubtitle || 'Apostolic exposition on sound doctrine',
      format: teachFormat,
      category: teachCategory,
      author: 'Apostle Nicholas Dlamini',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      duration: teachDuration || (teachFormat === 'audio' ? '45 min audio' : teachFormat === 'video' ? '1h 10m video' : '28 pages PDF'),
      scriptures: teachScriptures.split(',').map((s) => s.trim()).filter(Boolean),
      description: teachDescription || 'Sound doctrine instruction for generational builders.',
      youtubeUrl: teachYoutubeUrl.trim() || (teachFormat === 'video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined),
      youtubeVideoId: ytId || (teachFormat === 'video' ? 'dQw4w9WgXcQ' : undefined),
      audioUrl: teachAudioUrl.trim() || undefined,
      videoDetails: (ytId || teachFormat === 'video' || parsedChapters.length > 0)
        ? {
            embedId: ytId || 'dQw4w9WgXcQ',
            timestamps: parsedChapters.length > 0
              ? parsedChapters
              : [
                  { time: '00:00', label: 'Opening & Apostolic Foundation' },
                  { time: '15:00', label: 'Sound Doctrine Exposition' },
                  { time: '35:00', label: 'Ministry Fire & Altar Impartation' }
                ]
          }
        : undefined,
      keyRevelations: [
        'Building accurately preserves generational momentum.',
        'Never substitute popular acclaim for scriptural alignment.'
      ],
      downloadsCount: 1,
      listenCount: 1
    };

    onAddTeaching(newTeaching);
    setTeachTitle('');
    setTeachSubtitle('');
    setTeachDescription('');
    setTeachYoutubeUrl('');
    setTeachAudioUrl('');
    setTeachDuration('');
    onShowToast(`Sermon "${newTeaching.title}" posted to Vault!`);
  };

  // Open teaching edit drawer/modal
  const handleOpenEditTeaching = (t: Teaching) => {
    setEditingTeaching(t);
    setEditTitle(t.title);
    setEditSubtitle(t.subtitle);
    setEditFormat(t.format);
    setEditCategory(t.category);
    setEditDuration(t.duration);
    setEditYoutubeUrl(t.youtubeUrl || (t.youtubeVideoId ? `https://www.youtube.com/watch?v=${t.youtubeVideoId}` : ''));
    setEditAudioUrl(t.audioUrl || '');
    setEditScriptures(t.scriptures.join(', '));
    setEditDescription(t.description);
    setEditChapters(
      t.videoDetails?.timestamps?.map((ts) => `${ts.time} ${ts.label}`).join(', ') || ''
    );
  };

  // Save teaching edit
  const handleSaveTeachingEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeaching) return;

    const ytId = extractYouTubeVideoId(editYoutubeUrl);
    const parsedChapters = editChapters
      ? editChapters
          .split(',')
          .map((entry) => {
            const parts = entry.trim().split(/\s+(.+)/);
            if (parts.length >= 2) {
              return { time: parts[0].trim(), label: parts[1].trim() };
            }
            return null;
          })
          .filter((t): t is { time: string; label: string } => t !== null)
      : [];

    const updated: Teaching = {
      ...editingTeaching,
      title: editTitle || editingTeaching.title,
      subtitle: editSubtitle || editingTeaching.subtitle,
      format: editFormat,
      category: editCategory,
      duration: editDuration || editingTeaching.duration,
      scriptures: editScriptures.split(',').map((s) => s.trim()).filter(Boolean),
      description: editDescription || editingTeaching.description,
      youtubeUrl: editYoutubeUrl.trim() || undefined,
      youtubeVideoId: ytId || (editYoutubeUrl.trim() ? ytId : undefined),
      audioUrl: editAudioUrl.trim() || undefined,
      videoDetails: (ytId || parsedChapters.length > 0 || editingTeaching.videoDetails)
        ? {
            embedId: ytId || editingTeaching.videoDetails?.embedId || 'dQw4w9WgXcQ',
            timestamps: parsedChapters.length > 0
              ? parsedChapters
              : (editingTeaching.videoDetails?.timestamps || [
                  { time: '00:00', label: 'Opening & Foundation' },
                  { time: '15:00', label: 'Sound Doctrine' }
                ])
          }
        : undefined
    };

    if (onUpdateTeaching) {
      onUpdateTeaching(updated);
    }
    setEditingTeaching(null);
    onShowToast(`Sermon "${updated.title}" updated successfully!`);
  };

  // Submit itinerary
  const handleCreateItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itTitle || !itCity) return;

    const newEvent: ItineraryEvent = {
      id: `it-${Date.now()}`,
      title: itTitle,
      theme: 'Sound Ministry & Apostolic Alignment Summit',
      hostMinistry: itHost || 'The Smart Leaders Family Of Churches',
      city: itCity,
      country: itCountry,
      venue: itVenue || `${itCity} City Auditorium`,
      dateRange: itDates || 'Coming Soon',
      startDateISO: new Date().toISOString(),
      sessionTimes: 'Morning Leadership: 09:00 AM · Evening Revival: 18:00 PM',
      status: 'Upcoming',
      livestreamAvailable: true,
      livestreamPlatform: 'Facebook & YouTube Live',
      rsvpCount: 0,
      rsvpCapacity: 500,
      scripture: '1 Corinthians 3:10',
      contactEmail: 'itinerary@smartministry.org'
    };

    onAddItinerary(newEvent);
    setItCity('');
    setItTitle('');
    setItVenue('');
    setItHost('');
    setItDates('');
    onShowToast(`Whereabouts update in ${newEvent.city} announced!`);
  };

  // Calculate quick stats
  const totalOrdersValue = orders.reduce((sum, o) => {
    const val = parseInt(o.bookPrice.replace(/[^0-9]/g, '')) || 0;
    return sum + val;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] bg-slate-900 border border-amber-600/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-amber-950/60 to-slate-950 border-b border-amber-600/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500 overflow-hidden shrink-0 bg-black">
              <img
                src="/assets/aistudio/file_000000007c2c8208b2cc5202023513b7_3aeb00d7.png"
                alt="S.M.A.R.T"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-base font-bold text-amber-400">
                  Apostle Nicholas Dlamini — Admin Backend
                </h2>
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] rounded font-bold uppercase tracking-wider">
                  Master Control
                </span>
              </div>
              <p className="text-xs text-slate-300">
                S.M.A.R.T Content Engine · WhatsApp Orders · Push Broadcaster · Pastoral Care
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/26879309372`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 text-xs hover:bg-emerald-900/60 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {WHATSAPP_NUMBER}</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Admin Backend"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lock Screen if Not Authenticated */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-950/90">
            <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-amber-600/30 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/60 mx-auto flex items-center justify-center text-amber-400">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-cinzel text-xl font-bold text-white">
                  Ministerial Security Clearance
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access reserved for Apostle Nicholas Dlamini and authorized pastoral secretariat.
                </p>
              </div>

              <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Enter Security PIN (e.g. smart2026)"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setAuthError(false);
                    }}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-sm text-white tracking-widest focus:outline-none focus:border-amber-500"
                  />
                  {authError && (
                    <p className="text-xs text-red-400 mt-2 font-medium">
                      Incorrect security passcode. Try "smart2026" or click Instant Unlock below.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                >
                  Unlock Admin Backend
                </button>
              </form>

              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleInstantApostleUnlock}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium underline flex items-center justify-center gap-1.5 mx-auto"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Instant Apostle Nicholas One-Click Unlock</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Body */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-slate-950 border-r border-slate-800 p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-left ${
                  activeTab === 'overview'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Overview & Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-left ${
                  activeTab === 'reports'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Reports & Dispatches</span>
                {reports.length > 0 && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-mono">
                    {reports.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('broadcast')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-left ${
                  activeTab === 'broadcast'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Push Notifications</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-left ${
                  activeTab === 'orders'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Book Orders ({orders.length})</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  {orders.filter((o) => o.status === 'Pending Review').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('teachings')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-left ${
                  activeTab === 'teachings'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>Teachings Vault</span>
              </button>

              <button
                onClick={() => setActiveTab('books')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-left ${
                  activeTab === 'books'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Books & Links</span>
              </button>

              <button
                onClick={() => setActiveTab('petitions')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-left ${
                  activeTab === 'petitions'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Prayer Petitions</span>
              </button>

              <button
                onClick={() => setActiveTab('itinerary')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-left ${
                  activeTab === 'itinerary'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Whereabouts</span>
              </button>
            </div>

            {/* Main Tab Panel Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-900/60">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-white">
                      Executive Overview & Kingdom Reach
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time operational summary of S.M.A.R.T ministry assets, distribution, and follower engagement.
                    </p>
                  </div>

                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium uppercase">Book Orders</span>
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white">
                        {orders.length}
                      </div>
                      <p className="text-[11px] text-emerald-400 mt-1">
                        ZAR R{totalOrdersValue.toLocaleString()} in physical sales
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium uppercase">Teachings Vault</span>
                        <Headphones className="w-4 h-4 text-sky-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white">
                        {teachings.length}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Audio, Video & PDF monographs
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium uppercase">Published Books</span>
                        <BookOpen className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white">
                        {books.length}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        9 Books2Read universal editions
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-medium uppercase">Prayer Requests</span>
                        <Heart className="w-4 h-4 text-rose-400" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-white">
                        {petitions.length}
                      </div>
                      <p className="text-[11px] text-emerald-400 mt-1">
                        {petitions.filter((p) => p.prayedOver).length} lifted in apostolic prayer
                      </p>
                    </div>
                  </div>

                  {/* Fast Action Shortcuts */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('broadcast')}
                      className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-500/40 text-left hover:border-amber-400 transition-all group"
                    >
                      <Bell className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h4 className="font-semibold text-white text-sm">
                        Broadcast Push Alert
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Transmit instant notifications to all followers for live events or new teachings.
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab('reports')}
                      className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/40 text-left hover:border-emerald-400 transition-all group"
                    >
                      <FileText className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h4 className="font-semibold text-white text-sm">
                        Publish Field Report
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Post revival dispatches, building progress, or apostolic directives.
                      </p>
                    </button>

                    <a
                      href={FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-slate-950 border border-blue-500/40 text-left hover:border-blue-400 transition-all group"
                    >
                      <Globe className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                      <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
                        <span>Apostle's Facebook Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Open official Facebook page to check live stream status and comments.
                      </p>
                    </a>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-cinzel text-sm font-bold text-white">
                        Recent Physical Book Orders
                      </h4>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-amber-400 hover:underline"
                      >
                        View All Orders →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {orders.slice(0, 3).map((o) => (
                        <div
                          key={o.id}
                          className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-semibold text-white">
                              {o.customerName}
                            </span>
                            <span className="text-slate-400 ml-2">
                              ordered <strong className="text-amber-300">{o.bookTitle}</strong> ({o.bookPrice})
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {o.deliveryMethod.toUpperCase()} · {o.deliveryAddress}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              o.status === 'Pending Review'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {o.status}
                            </span>
                            <a
                              href={`https://wa.me/${o.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Shalom ${o.customerName}, this is Apostle Nicholas Dlamini's office regarding your order for "${o.bookTitle}".`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REPORTS & DISPATCHES */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-white">
                        Ministerial Reports & Revival Dispatches
                      </h3>
                      <p className="text-xs text-slate-400">
                        Publish official reports, revival testimonies, and building fund communiques.
                      </p>
                    </div>
                  </div>

                  {/* Publish Form */}
                  <form onSubmit={handlePublishReport} className="p-5 rounded-xl bg-slate-950 border border-amber-600/30 space-y-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Compose New Ministerial Report
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Report Title
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Apostolic Field Report: Eswatini Revival Assembly"
                          value={repTitle}
                          onChange={(e) => setRepTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={repCategory}
                          onChange={(e) => setRepCategory(e.target.value as MinisterialReport['category'])}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="Revival Dispatch">Revival Dispatch</option>
                          <option value="Apostolic Communique">Apostolic Communique</option>
                          <option value="Field Report">Field Report</option>
                          <option value="Building Project">Building Project</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Executive Summary (Shown in notifications & previews)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Brief summary of the breakthrough or directive..."
                        value={repSummary}
                        onChange={(e) => setRepSummary(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Report Content (Paragraphs separated by blank lines)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Detailed narrative of ministry results, testimonies, and apostolic directives..."
                        value={repContent}
                        onChange={(e) => setRepContent(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={repNotifyFollowers}
                          onChange={(e) => setRepNotifyFollowers(e.target.checked)}
                          className="rounded text-amber-500 focus:ring-0"
                        />
                        <span>Send instant push notification alert to all followers</span>
                      </label>

                      <button
                        type="submit"
                        className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Report Now</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Published Reports */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Published Reports ({reports.length})
                    </h4>

                    {reports.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                              {rep.category}
                            </span>
                            <h5 className="font-cinzel text-sm font-bold text-white mt-1">
                              {rep.title}
                            </h5>
                            <span className="text-slate-400 text-[11px]">
                              {rep.date} · {rep.author} · {rep.location}
                            </span>
                          </div>

                          <button
                            onClick={() => onDeleteReport(rep.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete Report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-slate-300 leading-relaxed">
                          {rep.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: BROADCAST PUSH NOTIFICATIONS WITH POSTERS & COVERS */}
              {activeTab === 'broadcast' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-cinzel text-lg font-bold text-white">
                        Live Push Broadcaster & Notification Center
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                        Posters & Covers Enabled
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Transmit immediate alerts to followers' browsers and device screens with attached high-resolution posters, book covers, and event flyers.
                    </p>
                  </div>

                  {/* Fast One-Click Broadcasters with Attached Posters */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Quick Pre-fills with Attached Posters & Covers:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setBcTitle('🚨 LIVE NOW: Apostle Nicholas Dlamini on Facebook');
                          setBcMessage('Join the ongoing apostolic fire and prophetic impartation session right now on Facebook & YouTube Live!');
                          setBcTargetTab('overview');
                          setBcType('live');
                          setBcUrgent(true);
                          setBcImageUrl('/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg');
                          setBcImageCaption('Apostle Nicholas Dlamini — Live Apostolic Impartation Flyer');
                          setBcActionLabel('Watch Live Stream');
                          onShowToast('Pre-filled live broadcast alert with Apostle Nicholas flyer!');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all text-xs space-y-1 ${
                          bcImageUrl === '/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg'
                            ? 'bg-red-950/40 border-red-500 shadow-md shadow-red-950/50'
                            : 'bg-slate-950/70 border-slate-800 hover:border-red-700/60'
                        }`}
                      >
                        <span className="font-bold text-red-300 flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
                          <span>Going Live Alert</span>
                        </span>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          With Apostle Nicholas portrait flyer
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBcTitle('📚 Book Release: How to Operate in Secular Babylon');
                          setBcMessage('Equip your ministry with apostolic strategies for kingdom marketplace impact. Order physical hardcover (R399) or eBook on Books2Read.');
                          setBcTargetTab('books');
                          setBcType('book');
                          setBcUrgent(false);
                          setBcImageUrl('/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg');
                          setBcImageCaption('How to Operate in Secular Babylon — Official Book Cover Flyer (R399)');
                          setBcActionLabel('Order Hardcover Copy');
                          onShowToast('Attached "Secular Babylon" official book flyer!');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all text-xs space-y-1 ${
                          bcImageUrl === '/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg'
                            ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-950/50'
                            : 'bg-slate-950/70 border-slate-800 hover:border-amber-700/60'
                        }`}
                      >
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>Secular Babylon (R399)</span>
                        </span>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          With 3D Hardcover Book Flyer
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBcTitle('🏛️ Church Building Project: Apostolic Prayer Manual');
                          setBcMessage('The Apostolic and Prophetic Prayer Manual (R350) is released! 100% of proceeds support our church sanctuary construction project.');
                          setBcTargetTab('books');
                          setBcType('book');
                          setBcUrgent(false);
                          setBcImageUrl('/assets/aistudio/FB_IMG_1793479322670_4123012d.jpg');
                          setBcImageCaption('The Apostolic & Prophetic Prayer Manual — Church Building Edition Flyer');
                          setBcActionLabel('Support Building Fund');
                          onShowToast('Attached "Prayer Manual" official building project flyer!');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all text-xs space-y-1 ${
                          bcImageUrl === '/assets/aistudio/FB_IMG_1793479322670_4123012d.jpg'
                            ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-950/50'
                            : 'bg-slate-950/70 border-slate-800 hover:border-amber-700/60'
                        }`}
                      >
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>Prayer Manual (R350)</span>
                        </span>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          With Church Building Project flyer
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBcTitle('🧠 Leadership Book: Five Senses of Successful Leaders');
                          setBcMessage('Unlock the five senses of successful leaders. Learn to see, discern, and lead with clarity. R100 plus R60 Paxi delivery across SA.');
                          setBcTargetTab('books');
                          setBcType('book');
                          setBcUrgent(false);
                          setBcImageUrl('/assets/aistudio/FB_IMG_1793479335252_6e135219.jpg');
                          setBcImageCaption('Five Senses of Successful Leaders — Official Book Flyer (R100)');
                          setBcActionLabel('Order via Paxi');
                          onShowToast('Attached "Five Senses" leadership book flyer!');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all text-xs space-y-1 ${
                          bcImageUrl === '/assets/aistudio/FB_IMG_1793479335252_6e135219.jpg'
                            ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-950/50'
                            : 'bg-slate-950/70 border-slate-800 hover:border-amber-700/60'
                        }`}
                      >
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Sparkle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Five Senses (R100)</span>
                        </span>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          With Leadership Book Flyer
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Broadcast Compose Form */}
                  <form onSubmit={handleTriggerBroadcast} className="p-5 rounded-2xl bg-slate-950 border border-amber-600/40 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" />
                        <span>Compose Push Broadcast for Followers</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Instant Web Push + In-App Chime
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Notification Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={bcTitle}
                          onChange={(e) => setBcTitle(e.target.value)}
                          placeholder="e.g. 🚨 LIVE TONIGHT: Apostle Nicholas Dlamini"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Notification Category
                        </label>
                        <select
                          value={bcType}
                          onChange={(e) => setBcType(e.target.value as NotificationItem['type'])}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="live">🔴 Live Stream Broadcast</option>
                          <option value="book">📚 Book Release & Cover</option>
                          <option value="teaching">🎙️ Sermon / Masterclass</option>
                          <option value="itinerary">✈️ Whereabouts & Summit</option>
                          <option value="report">📜 Revival Dispatch Report</option>
                          <option value="announcement">📢 General Announcement</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Notification Message Body *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={bcMessage}
                        onChange={(e) => setBcMessage(e.target.value)}
                        placeholder="Provide details about the gathering, book release, or revelation..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* POSTER & BOOK COVER UPLOAD SECTION */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-600/30 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          <label className="text-xs font-bold text-white uppercase tracking-wider">
                            Attach Poster, Book Cover, or Event Flyer
                          </label>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                            {bcImageUrl ? 'Attached' : 'Optional'}
                          </span>
                        </div>

                        {/* Mode Switcher */}
                        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setBcPosterMode('upload')}
                            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                              bcPosterMode === 'upload'
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload File</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setBcPosterMode('preset')}
                            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                              bcPosterMode === 'preset'
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Layers className="w-3 h-3" />
                            <span>Ministry Covers ({MINISTRY_POSTER_PRESETS.length})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setBcPosterMode('url')}
                            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                              bcPosterMode === 'url'
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <LinkIcon className="w-3 h-3" />
                            <span>Image URL</span>
                          </button>
                        </div>
                      </div>

                      {/* 1. UPLOAD FILE DROPZONE */}
                      {bcPosterMode === 'upload' && (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragOverPoster(true);
                          }}
                          onDragLeave={() => setIsDragOverPoster(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragOverPoster(false);
                            if (e.dataTransfer.files?.[0]) {
                              handlePosterFileUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                            isDragOverPoster
                              ? 'border-amber-400 bg-amber-950/30'
                              : 'border-slate-700 bg-slate-950/60 hover:border-amber-500/60 hover:bg-slate-950'
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handlePosterFileUpload(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 mb-2">
                            <Upload className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-semibold text-white block">
                            Click to upload new poster / book cover, or drag & drop file
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-1">
                            Supports PNG, JPG, JPEG, WEBP · High-resolution flyers recommended
                          </span>
                        </div>
                      )}

                      {/* 2. OFFICIAL PRESET COVERS & POSTERS */}
                      {bcPosterMode === 'preset' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                          {MINISTRY_POSTER_PRESETS.map((preset) => {
                            const isSelected = bcImageUrl === preset.url;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                  setBcImageUrl(preset.url);
                                  setBcImageCaption(preset.name);
                                  onShowToast(`Attached ${preset.name}!`);
                                }}
                                className={`relative p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all group ${
                                  isSelected
                                    ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/30'
                                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-black/60 relative border border-slate-800">
                                  <img
                                    src={preset.thumbnail}
                                    alt={preset.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  )}
                                </div>
                                <span className="text-[10px] font-semibold text-white line-clamp-1 text-center w-full">
                                  {preset.name}
                                </span>
                                <span className="text-[9px] text-amber-400/80 line-clamp-1 text-center">
                                  {preset.category}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 3. IMAGE URL INPUT */}
                      {bcPosterMode === 'url' && (
                        <div className="space-y-1.5">
                          <label className="block text-[11px] text-slate-400">
                            Paste Direct Image / Flyer Link
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={bcImageUrl}
                              onChange={(e) => setBcImageUrl(e.target.value)}
                              placeholder="https://.../poster.jpg"
                              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                            />
                            {bcImageUrl && (
                              <button
                                type="button"
                                onClick={() => setBcImageUrl('')}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* LIVE ATTACHED POSTER PREVIEW */}
                      {bcImageUrl && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-amber-500/60 shadow shrink-0 bg-black">
                              <img
                                src={bcImageUrl}
                                alt="Attached Poster Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-1.5 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  <span>Poster Attached to Broadcast</span>
                                </span>
                              </div>
                              <input
                                type="text"
                                value={bcImageCaption}
                                onChange={(e) => setBcImageCaption(e.target.value)}
                                placeholder="Poster caption or flyer subtitle..."
                                className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400">Button:</span>
                                <input
                                  type="text"
                                  value={bcActionLabel}
                                  onChange={(e) => setBcActionLabel(e.target.value)}
                                  placeholder="e.g. Order Copy Now"
                                  className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-200 w-36 focus:outline-none focus:border-amber-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setBcImageUrl('');
                                setBcImageCaption('');
                                onShowToast('Poster detached.');
                              }}
                              className="px-3 py-1.5 bg-red-950/60 border border-red-800/60 text-red-300 hover:text-white hover:bg-red-900/60 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Poster</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Target Screen on Notification Click
                        </label>
                        <select
                          value={bcTargetTab}
                          onChange={(e) => setBcTargetTab(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="overview">Vision & Main Overview</option>
                          <option value="teachings">Teachings Vault</option>
                          <option value="books">Books for Sale (ND Publishers)</option>
                          <option value="itinerary">Live Calendar & Whereabouts</option>
                          <option value="reports">Reports & Dispatches</option>
                        </select>
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bcUrgent}
                            onChange={(e) => setBcUrgent(e.target.checked)}
                            className="rounded text-red-500 focus:ring-0"
                          />
                          <span className="font-semibold text-red-400">
                            High Priority (Sound chime + instant popup)
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-black/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Transmit Notification Everywhere {bcImageUrl && 'with Poster Attached'}</span>
                    </button>
                  </form>

                  {/* Broadcast History */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Recent Transmissions & Notifications ({notifications.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            {n.imageUrl && (
                              <img
                                src={n.imageUrl}
                                alt="Poster"
                                className="w-10 h-12 object-cover rounded border border-amber-600/40 shrink-0"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-white block">
                                  {n.title}
                                </span>
                                {n.imageUrl && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                                    Poster
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-400 text-[11px] block mt-0.5 line-clamp-1">
                                {n.message}
                              </span>
                              <span className="text-slate-500 text-[10px] font-mono mt-0.5 block">
                                {n.timestamp} · Type: {n.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ORDERS & DISTRIBUTION */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-white">
                      Physical Book Orders & Customer WhatsApp Secretariat
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage orders placed by followers, connect directly via WhatsApp ({WHATSAPP_NUMBER}), and dispatch books.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {orders.length === 0 ? (
                      <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
                        No orders recorded yet.
                      </div>
                    ) : (
                      orders.map((ord) => {
                        const cleanPhone = ord.customerPhone.replace(/[^0-9]/g, '');
                        const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Shalom ${ord.customerName}! Apostle Nicholas Dlamini's office is confirming your order for "${ord.bookTitle}" (${ord.bookPrice}). We are finalizing dispatch via ${ord.deliveryMethod.toUpperCase()}. Delivery address: ${ord.deliveryAddress}.`
                        )}`;

                        return (
                          <div
                            key={ord.id}
                            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-cinzel font-bold text-white text-sm">
                                    {ord.customerName}
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                                    #{ord.id}
                                  </span>
                                </div>
                                <span className="text-slate-400 text-[11px]">
                                  {ord.customerEmail} · {ord.customerPhone} · {ord.timestamp}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <select
                                  value={ord.status}
                                  onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as BookOrder['status'])}
                                  className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-white rounded text-xs focus:outline-none focus:border-amber-500"
                                >
                                  <option value="Pending Review">Pending Review</option>
                                  <option value="Dispatched via Courier">Dispatched via Courier</option>
                                  <option value="Collected via PAXI">Collected via PAXI</option>
                                  <option value="Delivered">Delivered</option>
                                </select>

                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp Buyer</span>
                                </a>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                              <div>
                                <span className="text-slate-500 uppercase font-mono block">Book Title</span>
                                <span className="text-amber-300 font-semibold">{ord.bookTitle}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 uppercase font-mono block">Price & Method</span>
                                <span className="text-white font-mono">{ord.bookPrice} · {ord.deliveryMethod.toUpperCase()}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 uppercase font-mono block">Delivery Destination</span>
                                <span className="text-slate-300">{ord.deliveryAddress}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: TEACHINGS VAULT (YOUTUBE SERMON LINKING & CONTENT MANAGEMENT) */}
              {activeTab === 'teachings' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-red-600/20 text-red-400">
                          <Play className="w-4 h-4 fill-red-400" />
                        </span>
                        <h3 className="font-cinzel text-lg font-bold text-white">
                          Teachings & YouTube Sermons Vault
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Link your official YouTube sermons, live broadcasts, audio podcasts, and PDF study monographs. Followers can watch YouTube videos directly inside the app with chapter timestamps.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTeachTitle('Apostolic Foundations & End-Time Revival');
                          setTeachSubtitle('Building with scriptural accuracy to withstand generational storms');
                          setTeachFormat('video');
                          setTeachCategory('Apostolic Order');
                          setTeachYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                          setTeachDuration('1h 05m video');
                          setTeachChapters('00:00 Welcome & Opening Altar, 15:30 Apostolic Alignment, 42:10 Impartation of Fire');
                          setTeachScriptures('1 Corinthians 3:10, Ephesians 4:11-12');
                          setTeachDescription('A masterclass for emerging fivefold ministers on recovering biblical blueprints and divine order.');
                          onShowToast('Sample YouTube sermon details filled into form!');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pre-fill Sample YouTube Sermon</span>
                      </button>
                    </div>
                  </div>

                  {/* Sermon Upload / Link Form */}
                  <form onSubmit={handleCreateTeaching} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Post New Sermon or Teaching</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Supports YouTube, MP3 Audio & PDF
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Sermon Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Breaking Generational Traps in Ministry"
                          value={teachTitle}
                          onChange={(e) => setTeachTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Format *
                        </label>
                        <select
                          value={teachFormat}
                          onChange={(e) => setTeachFormat(e.target.value as 'audio' | 'video' | 'pdf')}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="video">Video Masterclass (YouTube Embed)</option>
                          <option value="audio">Audio Podcast / Sermon</option>
                          <option value="pdf">PDF Study Monograph</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Subtitle / Core Theme
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Navigating delays and spiritual blindspots in the prophetic"
                          value={teachSubtitle}
                          onChange={(e) => setTeachSubtitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={teachCategory}
                          onChange={(e) => setTeachCategory(e.target.value as Teaching['category'])}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="Apostolic Order">Apostolic Order</option>
                          <option value="Ministry Delay Traps">Ministry Delay Traps</option>
                          <option value="Holy Ghost Fire">Holy Ghost Fire</option>
                          <option value="Prophetic Accuracy">Prophetic Accuracy</option>
                          <option value="Fivefold Architecture">Fivefold Architecture</option>
                          <option value="Sound Doctrine">Sound Doctrine</option>
                        </select>
                      </div>
                    </div>

                    {/* YouTube Linking Field */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-red-900/40 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <label className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                          <span>YouTube Sermon Link or Video ID</span>
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Paste YouTube URL, Shorts, Live link, or 11-char ID
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
                            value={teachYoutubeUrl}
                            onChange={(e) => setTeachYoutubeUrl(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                          />
                          {teachYoutubeUrl && (
                            <button
                              type="button"
                              onClick={() => setTeachYoutubeUrl('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Live YouTube Detection Card */}
                      {(() => {
                        const detectedId = extractYouTubeVideoId(teachYoutubeUrl);
                        if (!detectedId) return null;
                        return (
                          <div className="p-3 rounded-lg bg-black/60 border border-red-500/30 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://img.youtube.com/vi/${detectedId}/mqdefault.jpg`}
                                alt="YouTube Thumbnail Preview"
                                className="w-20 h-12 rounded object-cover border border-red-900/50 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div>
                                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Valid YouTube Video Detected</span>
                                </span>
                                <span className="text-slate-400 font-mono text-[11px] block mt-0.5">
                                  Video ID: <strong className="text-white">{detectedId}</strong>
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setPreviewTeaching({
                                  id: 'preview-temp',
                                  title: teachTitle || 'Sermon Preview',
                                  subtitle: teachSubtitle || 'YouTube Embed Test',
                                  format: 'video',
                                  category: teachCategory,
                                  author: 'Apostle Nicholas Dlamini',
                                  date: 'Preview',
                                  duration: teachDuration || '1h 10m',
                                  scriptures: teachScriptures.split(',').map((s) => s.trim()).filter(Boolean),
                                  description: teachDescription || 'Preview test for YouTube playback.',
                                  youtubeUrl: teachYoutubeUrl,
                                  youtubeVideoId: detectedId,
                                  keyRevelations: ['Tested and confirmed playable.'],
                                  downloadsCount: 0,
                                  listenCount: 0
                                });
                              }}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span>Test Play Embed</span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Chapter Timestamps & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Video Chapters / Milestones (Separated by commas)
                        </label>
                        <input
                          type="text"
                          placeholder="00:00 Welcome, 15:30 Prophetic Word, 40:00 Altar Fire"
                          value={teachChapters}
                          onChange={(e) => setTeachChapters(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Format: [MM:SS] Title, [MM:SS] Title (allows users to jump straight to sections)
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Duration Label
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 58 min video or 1h 14m masterclass"
                          value={teachDuration}
                          onChange={(e) => setTeachDuration(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Optional Audio URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Audio Stream / MP3 URL (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="https://.../sermon.mp3 (optional audio link)"
                          value={teachAudioUrl}
                          onChange={(e) => setTeachAudioUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Scriptures Reference
                        </label>
                        <input
                          type="text"
                          placeholder="1 Corinthians 3:10, Galatians 4:1-2"
                          value={teachScriptures}
                          onChange={(e) => setTeachScriptures(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Doctrinal Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Core explanation of the revelation, key takeaways, and apostolic admonition..."
                        value={teachDescription}
                        onChange={(e) => setTeachDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post Sermon & Teaching to Vault</span>
                    </button>
                  </form>

                  {/* Teachings List with YouTube Link Actions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Current Teachings & Sermons ({teachings.length})
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Click "Link / Edit YouTube" to connect or update any video sermon
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                      {teachings.map((t) => {
                        const ytId = extractYouTubeVideoId(t.youtubeUrl || t.youtubeVideoId || t.videoDetails?.embedId);
                        const hasYouTube = Boolean(ytId);

                        return (
                          <div
                            key={t.id}
                            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  t.format === 'video'
                                    ? 'bg-red-500/20 text-red-300 border border-red-800/40'
                                    : t.format === 'audio'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-800/40'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-800/40'
                                }`}>
                                  {t.format}
                                </span>

                                {hasYouTube ? (
                                  <span className="px-2 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40 text-[10px] font-mono flex items-center gap-1">
                                    <Play className="w-2.5 h-2.5 fill-red-400" />
                                    <span>YouTube: {ytId}</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                                    No YouTube link
                                  </span>
                                )}

                                <span className="text-slate-400 text-[11px]">· {t.category}</span>
                                <span className="text-slate-400 text-[11px]">· {t.duration}</span>
                              </div>

                              <h5 className="font-cinzel font-bold text-white text-sm">
                                {t.title}
                              </h5>
                              <p className="text-slate-400 text-[11px] line-clamp-1 italic">
                                "{t.subtitle}"
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {/* Test play if YouTube is connected */}
                              {hasYouTube && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewTeaching(t)}
                                  className="px-2.5 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                                  title="Test Play YouTube Embed"
                                >
                                  <Play className="w-3 h-3 fill-white" />
                                  <span>Watch Test</span>
                                </button>
                              )}

                              {/* Edit or Link YouTube */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditTeaching(t)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                                title="Edit Teaching & Attach YouTube Link"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>{hasYouTube ? 'Edit YouTube Link' : 'Attach YouTube Link'}</span>
                              </button>

                              <button
                                onClick={() => onDeleteTeaching(t.id)}
                                className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded hover:bg-slate-900"
                                title="Delete Teaching"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* EDIT TEACHING MODAL */}
                  {editingTeaching && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                              Edit Sermon & Link YouTube
                            </span>
                            <h3 className="font-cinzel text-base font-bold text-white">
                              {editingTeaching.title}
                            </h3>
                          </div>
                          <button
                            onClick={() => setEditingTeaching(null)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={handleSaveTeachingEdit} className="space-y-3 text-xs">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Sermon Title
                            </label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">
                                Format
                              </label>
                              <select
                                value={editFormat}
                                onChange={(e) => setEditFormat(e.target.value as 'audio' | 'video' | 'pdf')}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                              >
                                <option value="video">Video Masterclass (YouTube Embed)</option>
                                <option value="audio">Audio Podcast / Sermon</option>
                                <option value="pdf">PDF Study Monograph</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">
                                Duration Label
                              </label>
                              <input
                                type="text"
                                value={editDuration}
                                onChange={(e) => setEditDuration(e.target.value)}
                                placeholder="e.g. 1h 14m video"
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>

                          {/* YouTube link in editor */}
                          <div className="p-3 rounded-xl bg-slate-950 border border-red-900/40 space-y-2">
                            <label className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                              <Play className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                              <span>YouTube Sermon URL or Video ID</span>
                            </label>
                            <input
                              type="text"
                              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                              value={editYoutubeUrl}
                              onChange={(e) => setEditYoutubeUrl(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                            />

                            {(() => {
                              const editDetectedId = extractYouTubeVideoId(editYoutubeUrl);
                              if (!editDetectedId) return null;
                              return (
                                <div className="p-2.5 rounded bg-black/60 border border-red-500/30 flex items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={`https://img.youtube.com/vi/${editDetectedId}/mqdefault.jpg`}
                                      alt="Thumbnail"
                                      className="w-16 h-10 rounded object-cover border border-red-900/40 shrink-0"
                                    />
                                    <span className="text-emerald-400 font-mono text-[11px]">
                                      ✓ Video ID: {editDetectedId}
                                    </span>
                                  </div>
                                  <a
                                    href={`https://www.youtube.com/watch?v=${editDetectedId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-red-300 hover:text-white flex items-center gap-1"
                                  >
                                    <span>Open on YouTube</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              );
                            })()}
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Chapter Timestamps (e.g. 00:00 Welcome, 15:30 Prophetic Foundation)
                            </label>
                            <input
                              type="text"
                              value={editChapters}
                              onChange={(e) => setEditChapters(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Audio Stream URL (Optional)
                            </label>
                            <input
                              type="text"
                              value={editAudioUrl}
                              onChange={(e) => setEditAudioUrl(e.target.value)}
                              placeholder="https://.../sermon.mp3"
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Scriptures
                            </label>
                            <input
                              type="text"
                              value={editScriptures}
                              onChange={(e) => setEditScriptures(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => setEditingTeaching(null)}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow"
                            >
                              Save Sermon & Links
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: BOOKS & BOOKSTORE */}
              {activeTab === 'books' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-white">
                        Books by Nicholas Dlamini & Books2Read Store
                      </h3>
                      <p className="text-xs text-slate-400">
                        Manage physical inventory prices, cover images, and global universal eBook links ({books.length} publications).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsRegisteringBook(!isRegisteringBook)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isRegisteringBook ? 'Hide Form' : 'Register New Book with Cover'}</span>
                    </button>
                  </div>

                  {/* Register New Book Form with Cover Upload */}
                  {isRegisteringBook && (
                    <form onSubmit={handleCreateBookWithCover} className="p-5 rounded-2xl bg-slate-950 border border-amber-600/40 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>Publish New Book with Cover Image</span>
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Adds book & broadcasts notification
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Book Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. The Apostolic and Prophetic Prayer Manual"
                            value={newBookTitle}
                            onChange={(e) => setNewBookTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Subtitle / Theme
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. A Practical Guide to Effective and Purpose-Driven Prayer"
                            value={newBookSubtitle}
                            onChange={(e) => setNewBookSubtitle(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Price (e.g. R350) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="R350"
                            value={newBookPrice}
                            onChange={(e) => setNewBookPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Courier / Paxi Fee
                          </label>
                          <input
                            type="text"
                            placeholder="plus R60 courier fee"
                            value={newBookCourier}
                            onChange={(e) => setNewBookCourier(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Format Edition
                          </label>
                          <select
                            value={newBookType}
                            onChange={(e) => setNewBookType(e.target.value as Book['type'])}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="Hardcover">Hardcover</option>
                            <option value="Paperback">Paperback</option>
                            <option value="eBook">eBook</option>
                            <option value="Digital Universal Edition">Digital Universal Edition</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Books2Read Universal Store Link (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="https://books2read.com/u/..."
                          value={newBookB2RUrl}
                          onChange={(e) => setNewBookB2RUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      {/* BOOK COVER UPLOAD COMPONENT */}
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                            <span>Book Cover Image Upload *</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => bookCoverInputRef.current?.click()}
                            className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-xs font-semibold hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Browse Image File</span>
                          </button>
                        </div>

                        <input
                          ref={bookCoverInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleBookCoverFileUpload(e.target.files[0]);
                          }}
                          className="hidden"
                        />

                        {/* Preset Cover Selector for Books */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {MINISTRY_POSTER_PRESETS.map((p) => {
                            const isChosen = newBookCover === p.url;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => setNewBookCover(p.url)}
                                className={`p-1.5 rounded-lg border text-left flex flex-col items-center gap-1 transition-all ${
                                  isChosen
                                    ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/30'
                                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <img
                                  src={p.thumbnail}
                                  alt={p.name}
                                  className="w-full aspect-[3/4] object-cover rounded"
                                />
                                <span className="text-[9px] text-white text-center line-clamp-1 w-full">
                                  {p.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Active Cover Preview */}
                        {newBookCover && (
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-black/60 border border-slate-700">
                            <img
                              src={newBookCover}
                              alt="Book Cover Preview"
                              className="w-12 h-16 object-cover rounded border border-amber-500"
                            />
                            <div className="text-xs">
                              <span className="font-semibold text-emerald-400 block">
                                ✓ Cover Image Ready
                              </span>
                              <span className="text-slate-400 text-[11px] block truncate max-w-sm">
                                {newBookCover.slice(0, 60)}...
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Book Synopsis / Overview
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Brief description of the book's core themes and target readers..."
                          value={newBookSynopsis}
                          onChange={(e) => setNewBookSynopsis(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newBookNotify}
                            onChange={(e) => setNewBookNotify(e.target.checked)}
                            className="rounded text-amber-500 focus:ring-0"
                          />
                          <span>Broadcast Push Notification to Followers with this Cover</span>
                        </label>

                        <button
                          type="submit"
                          className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Publish Book with Cover</span>
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {books.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs"
                      >
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-14 h-20 rounded object-cover border border-slate-700 shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <h5 className="font-cinzel font-bold text-white text-xs leading-snug">
                            {b.title}
                          </h5>
                          <span className="text-amber-300 font-mono text-[11px] block font-bold">
                            {b.price} {b.courierFee && `(${b.courierFee})`}
                          </span>
                          <p className="text-[10px] text-slate-400 line-clamp-2">
                            {b.synopsis}
                          </p>
                          {b.onlinePurchaseUrl && (
                            <a
                              href={b.onlinePurchaseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-sky-400 hover:underline flex items-center gap-1 font-mono pt-1"
                            >
                              <span>Books2Read: {b.onlinePurchaseUrl}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: PRAYER PETITIONS */}
              {activeTab === 'petitions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-white">
                      Intercessory Prayer Petitions & Pastoral Care
                    </h3>
                    <p className="text-xs text-slate-400">
                      Review prayer requests from saints and leaders. Mark as prayed over or reach out on WhatsApp.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {petitions.length === 0 ? (
                      <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
                        No prayer petitions submitted yet.
                      </div>
                    ) : (
                      petitions.map((pet) => (
                        <div
                          key={pet.id}
                          className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                  {pet.name}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                                  {pet.category}
                                </span>
                              </div>
                              <span className="text-slate-400 text-[11px]">
                                {pet.phone || 'No phone'} · {pet.email || 'No email'} · {pet.timestamp}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {pet.phone && (
                                <a
                                  href={`https://wa.me/${pet.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `Shalom ${pet.name}, Apostle Nicholas Dlamini received your prayer petition regarding "${pet.category}". May the God of heaven release supernatural intervention!`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              )}

                              <button
                                onClick={() => onMarkPetitionPrayed(pet.id, 'Lifted up in apostolic prayer altar')}
                                className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                                  pet.prayedOver
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                <span>{pet.prayedOver ? 'Prayed Over' : 'Mark Prayed'}</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-300 p-2.5 rounded bg-slate-900 border border-slate-800/80 italic">
                            "{pet.petitionText}"
                          </p>

                          {pet.ministerNote && (
                            <p className="text-[11px] text-amber-300">
                              ★ Pastoral Note: {pet.ministerNote}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 8: ITINERARY */}
              {activeTab === 'itinerary' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-white">
                      Ministerial Itinerary & Whereabouts Manager
                    </h3>
                    <p className="text-xs text-slate-400">
                      Announce tour dates, host churches, city venues, and RSVP seat allotments.
                    </p>
                  </div>

                  <form onSubmit={handleCreateItinerary} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Announce Upcoming Ministerial Whereabouts
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Conference / Summit Title
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. End-Time Revival & Alignment Summit"
                          value={itTitle}
                          onChange={(e) => setItTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          City & Country
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Durban"
                            value={itCity}
                            onChange={(e) => setItCity(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                          <input
                            type="text"
                            required
                            placeholder="e.g. South Africa"
                            value={itCountry}
                            onChange={(e) => setItCountry(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Venue
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ICC Exhibition Hall"
                          value={itVenue}
                          onChange={(e) => setItVenue(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Dates
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. November 18 – 21, 2026"
                          value={itDates}
                          onChange={(e) => setItDates(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post Whereabouts to App</span>
                    </button>
                  </form>

                  {/* List of itinerary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Current Itinerary Events ({itinerary.length})
                    </h4>
                    <div className="space-y-2">
                      {itinerary.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold text-white">{ev.title}</span>
                            <span className="text-slate-400 block text-[11px]">
                              {ev.city}, {ev.country} · {ev.dateRange} · {ev.venue}
                            </span>
                          </div>
                          <span className="text-amber-300 font-mono text-[11px]">
                            {ev.rsvpCount}/{ev.rsvpCapacity} RSVPs
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Video Player Modal for Admin Testing */}
        {previewTeaching && (
          <VideoPlayerModal
            teaching={previewTeaching}
            onClose={() => setPreviewTeaching(null)}
          />
        )}

      </div>
    </div>
  );
};
