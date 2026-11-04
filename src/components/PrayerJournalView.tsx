import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  Download,
  Calendar,
  Search,
  Filter,
  Flame,
  Award,
  HeartHandshake,
  Share2,
  X,
  Check
} from 'lucide-react';
import { JournalEntry } from '../data/smartData';
import { soundEffects } from '../services/soundEffects';

interface PrayerJournalViewProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  onUpdateEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const PrayerJournalView: React.FC<PrayerJournalViewProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onShowToast,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAnswered, setOnlyAnswered] = useState(false);

  // Modal State for New/Edit Entry
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<JournalEntry['category']>('Scripture Study');
  const [formScriptures, setFormScriptures] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formPrayerPoints, setFormPrayerPoints] = useState<string[]>(['']);
  const [formIsAnswered, setFormIsAnswered] = useState(false);
  const [formAnsweredTestimony, setFormAnsweredTestimony] = useState('');

  // Celebration modal for marking answered
  const [celebratingEntry, setCelebratingEntry] = useState<JournalEntry | null>(null);
  const [testimonyInput, setTestimonyInput] = useState('');

  // Quick template loaders
  const loadTemplate = (type: 'scripture' | 'petition' | 'revelation') => {
    if (type === 'scripture') {
      setFormCategory('Scripture Study');
      setFormTitle('Scripture Study: 1 Corinthians 3:10 — The Wise Master Builder');
      setFormScriptures('1 Corinthians 3:10-15, Ephesians 2:20, Nehemiah 4:17');
      setFormNotes(`• OBSERVATION & CONTEXT:
Paul describes apostolic ministry not as sensational oratory, but as structural architecture according to the grace of God.

• DOCTRINAL REVELATION:
Foundation stones must be laid with precision. Charisma attracts crowds, but sound doctrine sustains generations. A hasty builder uses cheap materials (wood, hay, stubble) that perish in the day of fire.

• PERSONAL APPLICATION:
Audit our ministry schedule. Prioritize deep biblical discipleship over temporary hype. Strengthen our leadership eldership accountability.`);
      setFormPrayerPoints([
        'Deliver my spirit from superficial building and ministry delay.',
        'Grant our leadership council the wisdom of a master architect.',
        'Preserve the pure apostolic fountain and holy fear of God in our midst.'
      ]);
      onShowToast('Scripture Study Template loaded!');
    } else if (type === 'petition') {
      setFormCategory('Prayer Petition');
      setFormTitle('Fervent Petition: Breakthrough & Church Sanctuary Advancement');
      setFormScriptures('James 5:16, Haggai 2:7-9, 2 Corinthians 10:4');
      setFormNotes(`• THE NEED & PETITION:
Standing in agreement with Apostle Nicholas Dlamini for financial breakthrough and territorial victory over our church building project.

• COVENANT GROUND:
"The glory of this latter house shall be greater than the former, says the Lord of hosts." We enforce celestial law over our land.

• STRATEGY & FAITH ACTION:
Supporting ND Publishers book distribution and dedicating 1 hour of morning altar intercession.`);
      setFormPrayerPoints([
        'Break all economic embargoes and delays over the sanctuary building.',
        'Release righteous kingdom sponsors across Southern Africa and beyond.',
        'Anoint our book orders to bear spiritual fruit in every recipient household.'
      ]);
      onShowToast('Prayer Petition Template loaded!');
    } else {
      setFormCategory('Prophetic Revelation');
      setFormTitle('Prophetic Directive: Keeping the Altar Fire Perpetual');
      setFormScriptures('Leviticus 6:12-13, Acts 2:1-4, Luke 3:16');
      setFormNotes(`• THE PROPHETIC DIRECTIVE:
The fire shall never go out. Fire departs when human machinery replaces genuine brokenness before God.

• DIVINE MANDATE:
Re-anchor corporate prayer meetings around adoration, repentance, and seeking the face of Christ. Do not allow program routines to quench the Holy Spirit.`);
      setFormPrayerPoints([
        'Restore the spirit of travail and weeping between the porch and the altar.',
        'Kindle unquenchable fire in our youth and emerging fivefold ministers.',
        'Make our local church an epicenter of end-time revival in our community.'
      ]);
      onShowToast('Prophetic Revelation Template loaded!');
    }
  };

  const handleOpenNewModal = () => {
    setEditingEntryId(null);
    setFormTitle('');
    setFormCategory('Scripture Study');
    setFormScriptures('');
    setFormNotes('');
    setFormPrayerPoints(['']);
    setFormIsAnswered(false);
    setFormAnsweredTestimony('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setFormTitle(entry.title);
    setFormCategory(entry.category);
    setFormScriptures(entry.scriptures.join(', '));
    setFormNotes(entry.notes);
    setFormPrayerPoints(entry.prayerPoints.length > 0 ? entry.prayerPoints : ['']);
    setFormIsAnswered(entry.isAnswered);
    setFormAnsweredTestimony(entry.answeredTestimony || '');
    setIsModalOpen(true);
  };

  const handleAddPrayerPointField = () => {
    setFormPrayerPoints((prev) => [...prev, '']);
  };

  const handleUpdatePrayerPoint = (index: number, val: string) => {
    setFormPrayerPoints((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemovePrayerPoint = (index: number) => {
    setFormPrayerPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const cleanedPoints = formPrayerPoints.map((p) => p.trim()).filter(Boolean);
    const cleanedScriptures = formScriptures
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingEntryId) {
      const existing = entries.find((e) => e.id === editingEntryId);
      if (!existing) return;
      const updated: JournalEntry = {
        ...existing,
        title: formTitle,
        category: formCategory,
        scriptures: cleanedScriptures,
        notes: formNotes,
        prayerPoints: cleanedPoints,
        isAnswered: formIsAnswered,
        answeredDate: formIsAnswered ? existing.answeredDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
        answeredTestimony: formIsAnswered ? formAnsweredTestimony : undefined
      };
      onUpdateEntry(updated);
      onShowToast('Prayer Journal entry updated.');
    } else {
      const newEntry: JournalEntry = {
        id: `journal-${Date.now()}`,
        title: formTitle,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        category: formCategory,
        scriptures: cleanedScriptures,
        notes: formNotes,
        prayerPoints: cleanedPoints,
        isAnswered: formIsAnswered,
        answeredDate: formIsAnswered ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
        answeredTestimony: formIsAnswered ? formAnsweredTestimony : undefined,
        tags: [formCategory, ...cleanedScriptures.slice(0, 2)]
      };
      onAddEntry(newEntry);
      soundEffects.playAlertChime();
      onShowToast('New entry recorded in your Prayer Journal!');
    }

    setIsModalOpen(false);
  };

  // Toggle answered status
  const handleToggleAnswered = (entry: JournalEntry) => {
    if (!entry.isAnswered) {
      setCelebratingEntry(entry);
      setTestimonyInput(entry.answeredTestimony || '');
    } else {
      onUpdateEntry({
        ...entry,
        isAnswered: false,
        answeredDate: undefined,
        answeredTestimony: undefined
      });
      onShowToast(`Status reverted for "${entry.title}"`);
    }
  };

  const handleConfirmAnsweredCelebration = () => {
    if (!celebratingEntry) return;
    soundEffects.playAlertChime();
    onUpdateEntry({
      ...celebratingEntry,
      isAnswered: true,
      answeredDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      answeredTestimony: testimonyInput.trim() || 'Praise God! The Lord manifested His faithfulness according to His Word!'
    });
    setCelebratingEntry(null);
    setTestimonyInput('');
    onShowToast('🎉 Praise the Lord! Prayer marked as ANSWERED!');
  };

  // Export entry to plain text
  const handleExportEntry = (entry: JournalEntry) => {
    const text = `=====================================================
S.M.A.R.T - SOUND MINISTRY AND REFORMATION TOOLS
Apostle Nicholas Dlamini Devotional & Study Network
=====================================================
MY PRAYER & SCRIPTURE JOURNAL ENTRY

TITLE: ${entry.title}
DATE: ${entry.date}
CATEGORY: ${entry.category}
STATUS: ${entry.isAnswered ? `ANSWERED PRAYER (${entry.answeredDate})` : 'Active Intercession'}
SCRIPTURES STUDIED: ${entry.scriptures.join(', ') || 'N/A'}

-----------------------------------------------------
PERSONAL REVELATIONS & STUDY NOTES:
${entry.notes || 'No extended notes.'}

-----------------------------------------------------
INTERCESSORY PRAYER POINTS:
${entry.prayerPoints.map((pt, i) => `[ ] ${i + 1}. ${pt}`).join('\n')}

${entry.isAnswered && entry.answeredTestimony ? `-----------------------------------------------------\nTESTIMONY OF ANSWERED PRAYER:\n${entry.answeredTestimony}\n` : ''}
=====================================================
Recorded in S.M.A.R.T Apostolic Library
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PrayerJournal_${entry.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast(`Exported "${entry.title}"`);
  };

  // Filtered entries
  const filteredEntries = entries.filter((e) => {
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    const matchesAnswered = !onlyAnswered || e.isAnswered;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      e.title.toLowerCase().includes(query) ||
      e.notes.toLowerCase().includes(query) ||
      e.scriptures.some((s) => s.toLowerCase().includes(query)) ||
      e.prayerPoints.some((p) => p.toLowerCase().includes(query));
    return matchesCategory && matchesAnswered && matchesSearch;
  });

  const answeredCount = entries.filter((e) => e.isAnswered).length;

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-600/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-cinzel text-xl font-bold text-white">
              My Personal Prayer & Scripture Journal
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Record personal revelations, scriptures studied from Apostle Nicholas Dlamini's teachings, and specific petitions. Celebrate answered prayers and maintain a personal altar of devotion.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Answered</span>
            <span className="font-cinzel font-bold text-amber-400 text-sm">{answeredCount} of {entries.length}</span>
          </div>

          <button
            onClick={handleOpenNewModal}
            className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Write Journal Entry</span>
          </button>
        </div>
      </div>

      {/* Control Strip: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, scriptures (e.g. 1 Cor 3:10), or petitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl focus:outline-none focus:border-amber-500 shrink-0"
          >
            <option value="all">All Categories</option>
            <option value="Scripture Study">Scripture Study</option>
            <option value="Prayer Petition">Prayer Petition</option>
            <option value="Prophetic Revelation">Prophetic Revelation</option>
            <option value="Personal Devotion">Personal Devotion</option>
            <option value="Ministry Directive">Ministry Directive</option>
          </select>

          <button
            onClick={() => setOnlyAnswered(!onlyAnswered)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
              onlyAnswered
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Answered Only ({answeredCount})</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="font-cinzel text-base font-bold text-white">No Journal Entries Found</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? 'Try modifying your search query or removing the category filter.'
              : 'Begin recording your personal prayer petitions and scripture insights by writing your first journal entry.'}
          </p>
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Entry</span>
          </button>
        </div>
      ) : (
        /* Journal Cards Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-xl relative ${
                entry.isAnswered
                  ? 'bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 border-amber-500/50 shadow-amber-950/20'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header Row: Category Badge + Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase font-mono tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {entry.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{entry.date}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleAnswered(entry)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                      entry.isAnswered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:border-amber-500'
                    }`}
                    title={entry.isAnswered ? 'Mark as ongoing' : 'Mark as answered prayer!'}
                  >
                    {entry.isAnswered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Answered!</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span>Mark Answered</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Answered Celebration Banner */}
                {entry.isAnswered && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Praise God! Answered Prayer Testimony</span>
                      {entry.answeredDate && (
                        <span className="text-[10px] font-mono text-amber-400/80 font-normal ml-auto">
                          {entry.answeredDate}
                        </span>
                      )}
                    </div>
                    {entry.answeredTestimony && (
                      <p className="mt-1 text-slate-200 italic leading-relaxed">
                        "{entry.answeredTestimony}"
                      </p>
                    )}
                  </div>
                )}

                {/* Entry Title */}
                <h4 className="font-cinzel text-lg font-bold text-white leading-snug">
                  {entry.title}
                </h4>

                {/* Scripture Pills */}
                {entry.scriptures.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {entry.scriptures.map((scrip) => (
                      <span
                        key={scrip}
                        className="px-2 py-0.5 bg-slate-950 rounded text-[11px] font-mono text-amber-300 border border-slate-800"
                      >
                        {scrip}
                      </span>
                    ))}
                  </div>
                )}

                {/* Notes Body */}
                {entry.notes && (
                  <div className="mt-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    {entry.notes}
                  </div>
                )}

                {/* Prayer Points Checklist */}
                {entry.prayerPoints.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <div className="text-[11px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                      Intercessory Prayer Decrees ({entry.prayerPoints.length})
                    </div>
                    <div className="space-y-1.5">
                      {entry.prayerPoints.map((pt, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800"
                        >
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportEntry(entry)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                    title="Export / Download Prayer Sheet"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(entry)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT ENTRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                  Personal Altar & Study Vault
                </span>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  {editingEntryId ? 'Edit Prayer Journal Entry' : 'Compose New Prayer Journal Entry'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Templates Strip */}
            {!editingEntryId && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Load Study & Prayer Preset Template:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => loadTemplate('scripture')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3 h-3 text-amber-400" />
                    <span>Scripture Study Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loadTemplate('petition')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <HeartHandshake className="w-3 h-3 text-emerald-400" />
                    <span>Fervent Petition Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loadTemplate('revelation')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Flame className="w-3 h-3 text-rose-400" />
                    <span>Prophetic Directive Template</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Entry Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Revelations from 1 Corinthians 3:10 on Foundation Laying"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as JournalEntry['category'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Scripture Study">Scripture Study</option>
                    <option value="Prayer Petition">Prayer Petition</option>
                    <option value="Prophetic Revelation">Prophetic Revelation</option>
                    <option value="Personal Devotion">Personal Devotion</option>
                    <option value="Ministry Directive">Ministry Directive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Scriptures Studied (Separated by commas)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Corinthians 3:10, Galatians 4:1-2"
                    value={formScriptures}
                    onChange={(e) => setFormScriptures(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Personal Reflections, Revelations & Study Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your personal insights, doctrinal alignment notes, or directives..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Dynamic Prayer Points List */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Intercessory Prayer Decrees / Points
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPrayerPointField}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formPrayerPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 w-4 text-center shrink-0">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        placeholder="Decree in faith according to the Word..."
                        value={point}
                        onChange={(e) => handleUpdatePrayerPoint(index, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      {formPrayerPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePrayerPoint(index)}
                          className="p-1.5 text-slate-500 hover:text-red-400"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Answered Toggle in Modal */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formIsAnswered}
                    onChange={(e) => setFormIsAnswered(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span className="font-bold text-amber-400">
                    Mark this petition as an ANSWERED PRAYER
                  </span>
                </label>

                {formIsAnswered && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Testimony / Evidence of God's Faithfulness:
                    </label>
                    <input
                      type="text"
                      placeholder="Briefly describe what God broke through or manifested..."
                      value={formAnsweredTestimony}
                      onChange={(e) => setFormAnsweredTestimony(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-emerald-700/50 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CELEBRATION MODAL FOR MARKING ANSWERED */}
      {celebratingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-2xl p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/30">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
              Celebrate God's Faithfulness
            </span>
            <h3 className="font-cinzel text-xl font-bold text-white mt-1">
              Mark as Answered Prayer!
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              "{celebratingEntry.title}"
            </p>

            <div className="mt-4 text-left">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Record your testimony of what the Lord has done:
              </label>
              <textarea
                rows={3}
                placeholder="Praise God! The Lord answered and manifested His Word..."
                value={testimonyInput}
                onChange={(e) => setTestimonyInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCelebratingEntry(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAnsweredCelebration}
                className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
              >
                Celebrate & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
