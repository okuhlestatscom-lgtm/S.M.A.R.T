import React, { useState } from 'react';
import { X, Plus, ShieldCheck, Radio, BookOpen, FileText, Headphones, Video, MapPin, Send, Check } from 'lucide-react';
import { Teaching, Book, ItineraryEvent, NotificationItem } from '../data/smartData';
import { soundEffects } from '../services/soundEffects';

interface MinisterAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeaching: (teaching: Teaching) => void;
  onAddBook: (book: Book) => void;
  onAddItinerary: (event: ItineraryEvent) => void;
  onBroadcastNotification: (item: NotificationItem) => void;
}

export const MinisterAdminModal: React.FC<MinisterAdminModalProps> = ({
  isOpen,
  onClose,
  onAddTeaching,
  onAddBook,
  onAddItinerary,
  onBroadcastNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'teaching' | 'book' | 'itinerary' | 'broadcast'>('broadcast');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Post Teaching Form State
  const [teachTitle, setTeachTitle] = useState('');
  const [teachSubtitle, setTeachSubtitle] = useState('');
  const [teachFormat, setTeachFormat] = useState<'audio' | 'video' | 'pdf'>('audio');
  const [teachCategory, setTeachCategory] = useState<Teaching['category']>('Ministry Delay Traps');
  const [teachScriptures, setTeachScriptures] = useState('1 Corinthians 3:10, Galatians 4:1-2');
  const [teachDescription, setTeachDescription] = useState('');
  const [teachRevelations, setTeachRevelations] = useState('');

  // 2. Post Book / eBook Form State
  const [bookTitle, setBookTitle] = useState('');
  const [bookSubtitle, setBookSubtitle] = useState('');
  const [bookType, setBookType] = useState<Book['type']>('Paperback');
  const [bookPages, setBookPages] = useState(250);
  const [bookPrice, setBookPrice] = useState('R250');
  const [bookSynopsis, setBookSynopsis] = useState('');
  const [bookChapter1, setBookChapter1] = useState('');

  // 3. Announce Whereabouts / Itinerary State
  const [itCity, setItCity] = useState('');
  const [itCountry, setItCountry] = useState('');
  const [itTitle, setItTitle] = useState('');
  const [itTheme, setItTheme] = useState('');
  const [itHost, setItHost] = useState('');
  const [itVenue, setItVenue] = useState('');
  const [itDates, setItDates] = useState('');
  const [itSessions, setItSessions] = useState('Morning Leadership: 9:00 AM · Evening Fire: 6:30 PM');

  // 4. Live Broadcast Alert State
  const [broadcastTitle, setBroadcastTitle] = useState('🚨 LIVE APOSTOLIC IMPARTATION TONIGHT');
  const [broadcastMessage, setBroadcastMessage] = useState('Apostle Nicholas Dlamini is ministering live. Join the stream now.');
  const [broadcastUrgent, setBroadcastUrgent] = useState(true);

  if (!isOpen) return null;

  const triggerSuccess = (msg: string) => {
    soundEffects.playAlertChime();
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 2800);
  };

  const handleCreateTeaching = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeaching: Teaching = {
      id: `t-${Date.now()}`,
      title: teachTitle,
      subtitle: teachSubtitle || 'Apostolic exposition on kingdom order',
      format: teachFormat,
      category: teachCategory,
      author: 'Apostle Nicholas Dlamini',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      duration: teachFormat === 'audio' ? '45 min audio' : teachFormat === 'video' ? '1h 05m video' : '30 pages PDF',
      scriptures: teachScriptures.split(',').map((s) => s.trim()).filter(Boolean),
      description: teachDescription,
      keyRevelations: teachRevelations.split('\n').filter(Boolean).length > 0
        ? teachRevelations.split('\n').filter(Boolean)
        : ['Building accurately preserves generational momentum.'],
      downloadsCount: 1,
      listenCount: 1,
      pdfContent: {
        summary: teachDescription,
        chapters: [
          {
            title: 'Section I: Foundational Principles',
            paragraphs: [teachDescription, 'Sound doctrine must guide the minister above personal desire for notoriety.']
          }
        ],
        reformationChecklist: [
          'Verify doctrinal balance against the Epistles.',
          'Guard against sensationalism and financial manipulation.'
        ]
      }
    };

    onAddTeaching(newTeaching);
    triggerSuccess('New teaching posted to the vault!');
    setTeachTitle('');
    setTeachSubtitle('');
    setTeachDescription('');
    setTeachRevelations('');
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook: Book = {
      id: `b-${Date.now()}`,
      title: bookTitle,
      subtitle: bookSubtitle,
      author: 'Nicholas Dlamini',
      coverImage: '/assets/aistudio/FB_IMG_1793479297508_fa43cc88.jpg',
      type: bookType,
      publishYear: `${new Date().getFullYear()} Edition`,
      pages: Number(bookPages),
      price: bookPrice,
      synopsis: bookSynopsis,
      keyTakeaways: [
        'Recognize subtle snares of premature promotion.',
        'Install fivefold governance in accordance with Ephesians 4.',
        'Sustain personal altar fire and holiness.'
      ],
      sampleChapters: [
        {
          number: 1,
          title: 'The Mandate of Accurate Building',
          text: [
            bookChapter1 || 'Every wise master builder must inspect the foundation before constructing the upper chambers.',
            'Without doctrinal accuracy, the house cannot withstand the winds of deception.'
          ]
        }
      ]
    };

    onAddBook(newBook);
    triggerSuccess('Book / eBook registered and updated!');
    setBookTitle('');
    setBookSubtitle('');
    setBookSynopsis('');
    setBookChapter1('');
  };

  const handleCreateItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: ItineraryEvent = {
      id: `it-${Date.now()}`,
      title: itTitle,
      theme: itTheme,
      hostMinistry: itHost,
      city: itCity,
      country: itCountry,
      venue: itVenue,
      dateRange: itDates,
      startDateISO: new Date().toISOString(),
      sessionTimes: itSessions,
      status: 'Upcoming',
      livestreamAvailable: true,
      rsvpCount: 1,
      rsvpCapacity: 1000,
      scripture: '1 Corinthians 3:10',
      contactEmail: 'itinerary@smartministrytools.org'
    };

    onAddItinerary(newEvent);
    triggerSuccess(`Whereabouts in ${itCity} announced!`);
    setItCity('');
    setItCountry('');
    setItTitle('');
    setItTheme('');
    setItHost('');
    setItVenue('');
    setItDates('');
  };

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const alertItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: broadcastTitle,
      message: broadcastMessage,
      timestamp: 'Just now',
      type: 'live',
      urgent: broadcastUrgent,
      read: false,
      targetTab: 'teachings'
    };

    onBroadcastNotification(alertItem);
    triggerSuccess('Follower live event broadcast dispatched with chime!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                Apostle Nicholas Abraham Desk
              </span>
              <h3 className="font-cinzel text-lg font-bold text-white">
                Content Management & Broadcast Portal
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success toast inside modal */}
        {successMessage && (
          <div className="px-6 py-3 bg-emerald-950 border-b border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-3 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'broadcast'
                ? 'border-amber-400 text-amber-400 font-bold bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-red-400" />
            <span>Broadcast Live Alert</span>
          </button>

          <button
            onClick={() => setActiveTab('teaching')}
            className={`px-4 py-3 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'teaching'
                ? 'border-amber-400 text-amber-400 font-bold bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Post Teaching (PDF/Audio/Video)</span>
          </button>

          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-3 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'book'
                ? 'border-amber-400 text-amber-400 font-bold bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Update Books & eBooks</span>
          </button>

          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-4 py-3 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'itinerary'
                ? 'border-amber-400 text-amber-400 font-bold bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Announce Whereabouts</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: BROADCAST LIVE NOTIFICATION */}
          {activeTab === 'broadcast' && (
            <form onSubmit={handleBroadcastAlert} className="space-y-4">
              <div className="p-3 bg-red-950/20 border border-red-800/40 rounded-xl text-xs text-red-200">
                🚨 Instantly push a live broadcast or emergency impartation notification to all followers with a herald chime.
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Broadcast Message & Directive
                </label>
                <textarea
                  rows={3}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgentFlag"
                  checked={broadcastUrgent}
                  onChange={(e) => setBroadcastUrgent(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="urgentFlag" className="text-xs text-slate-300 cursor-pointer">
                  Mark as High-Priority Urgent Notification (Banners & Push Alert)
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Broadcast Alert to Followers</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: POST TEACHING */}
          {activeTab === 'teaching' && (
            <form onSubmit={handleCreateTeaching} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Teaching Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Navigating The Wilderness of Preparation"
                    value={teachTitle}
                    onChange={(e) => setTeachTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Format (PDF, Audio, Video)
                  </label>
                  <select
                    value={teachFormat}
                    onChange={(e) => setTeachFormat(e.target.value as 'audio' | 'video' | 'pdf')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="audio">Audio (Sermon / Podcast)</option>
                    <option value="video">Video (Masterclass / Session)</option>
                    <option value="pdf">PDF (Study Monograph / Notes)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subtitle / Clarification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Breaking free from hidden traps of delay"
                    value={teachSubtitle}
                    onChange={(e) => setTeachSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category Pillar
                  </label>
                  <select
                    value={teachCategory}
                    onChange={(e) => setTeachCategory(e.target.value as Teaching['category'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Ministry Delay Traps">Ministry Delay Traps</option>
                    <option value="Holy Ghost Fire">Holy Ghost Fire</option>
                    <option value="Fivefold Architecture">Fivefold Architecture</option>
                    <option value="Sound Doctrine">Sound Doctrine</option>
                    <option value="Prophetic Accuracy">Prophetic Accuracy</option>
                    <option value="Apostolic Order">Apostolic Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Scriptures (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 Cor 3:10, Gal 4:1-2, Titus 1:9"
                  value={teachScriptures}
                  onChange={(e) => setTeachScriptures(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Synopsis / Theological Overview
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain why this teaching is critical for kingdom builders..."
                  value={teachDescription}
                  onChange={(e) => setTeachDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Revelations (1 per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="Apostolic revelation point 1&#10;Apostolic revelation point 2"
                  value={teachRevelations}
                  onChange={(e) => setTeachRevelations(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Teaching to SMART Vault</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: UPDATE BOOKS & EBOOKS */}
          {activeTab === 'book' && (
            <form onSubmit={handleCreateBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Book Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Purifying The Altar"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Book Format / Type
                  </label>
                  <select
                    value={bookType}
                    onChange={(e) => setBookType(e.target.value as Book['type'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="eBook">Digital eBook (In-App Reader)</option>
                    <option value="Hardcover">Hardcover Edition</option>
                    <option value="Paperback">Paperback Edition</option>
                    <option value="Digital Master Bundle">Digital Master Bundle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apostolic Prescriptions for 21st Century Assemblies"
                  value={bookSubtitle}
                  onChange={(e) => setBookSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={bookPages}
                    onChange={(e) => setBookPages(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Price (or 'Free Grant')
                  </label>
                  <input
                    type="text"
                    value={bookPrice}
                    onChange={(e) => setBookPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Book Synopsis
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of the book..."
                  value={bookSynopsis}
                  onChange={(e) => setBookSynopsis(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Chapter 1 Sample Preview Text
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste opening excerpt for followers to read in the eBook reader..."
                  value={bookChapter1}
                  onChange={(e) => setBookChapter1(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish / Update Book</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: ANNOUNCE WHEREABOUTS */}
          {activeTab === 'itinerary' && (
            <form onSubmit={handleCreateItinerary} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dallas, Texas"
                    value={itCity}
                    onChange={(e) => setItCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United States"
                    value={itCountry}
                    onChange={(e) => setItCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Summit / Gathering Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apostolic Convocation & Ordination"
                  value={itTitle}
                  onChange={(e) => setItTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Conference Theme
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Order of Melchizedek"
                  value={itTheme}
                  onChange={(e) => setItTheme(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Host Ministry / Church
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zion Embassy"
                    value={itHost}
                    onChange={(e) => setItHost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Dates Range
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. March 24 - 27, 2027"
                    value={itDates}
                    onChange={(e) => setItDates(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Auditorium / Venue
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kay Bailey Hutchison Convention Center"
                  value={itVenue}
                  onChange={(e) => setItVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Announce Whereabouts to Followers</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
