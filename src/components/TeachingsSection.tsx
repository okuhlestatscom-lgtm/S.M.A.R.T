import React, { useState, useMemo } from 'react';
import { Headphones, Video, FileText, Search, Play, BookOpen, Download, Check, Sparkles, Filter, Bookmark, ExternalLink } from 'lucide-react';
import { Teaching, YOUTUBE_CHANNEL_URL, YOUTUBE_CHANNEL_NAME, YOUTUBE_CHANNEL_HANDLE } from '../data/smartData';

interface TeachingsSectionProps {
  teachings: Teaching[];
  activeAudioId: string | null;
  bookmarkedIds?: string[];
  onPlayAudio: (teaching: Teaching) => void;
  onOpenVideo: (teaching: Teaching) => void;
  onOpenPdf: (teaching: Teaching) => void;
  onToggleBookmark?: (id: string) => void;
}

export const TeachingsSection: React.FC<TeachingsSectionProps> = ({
  teachings,
  activeAudioId,
  bookmarkedIds = [],
  onPlayAudio,
  onOpenVideo,
  onOpenPdf,
  onToggleBookmark,
}) => {
  const [formatFilter, setFormatFilter] = useState<'all' | 'audio' | 'video' | 'pdf'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedIds, setDownloadedIds] = useState<Record<string, boolean>>({});

  const categories = [
    'all',
    'Ministry Delay Traps',
    'Holy Ghost Fire',
    'Fivefold Architecture',
    'Sound Doctrine',
    'Prophetic Accuracy',
    'Apostolic Order',
  ];

  const filteredTeachings = useMemo(() => {
    return teachings.filter((item) => {
      const matchesFormat = formatFilter === 'all' || item.format === formatFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.scriptures.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFormat && matchesCategory && matchesSearch;
    });
  }, [teachings, formatFilter, categoryFilter, searchQuery]);

  const handleDownload = (teaching: Teaching) => {
    const content = `=====================================================
S.M.A.R.T - SOUND MINISTRY AND REFORMATION TOOLS
Apostle Nicholas Dlamini Teaching Vault
=====================================================

TITLE: ${teaching.title}
SUBTITLE: ${teaching.subtitle}
AUTHOR: ${teaching.author}
DATE: ${teaching.date}
CATEGORY: ${teaching.category}
FORMAT: ${teaching.format.toUpperCase()}
SCRIPTURES: ${teaching.scriptures.join(', ')}

-----------------------------------------------------
SYNOPSIS:
${teaching.description}

-----------------------------------------------------
KEY APOSTOLIC REVELATIONS:
${teaching.keyRevelations.map((rev, idx) => `${idx + 1}. ${rev}`).join('\n')}

${
  teaching.pdfContent
    ? `-----------------------------------------------------
STUDY MONOGRAPH & EXECUTIVE SUMMARY:
${teaching.pdfContent.summary}

REFORMATION CHECKLIST:
${teaching.pdfContent.reformationChecklist.map((item, idx) => `[ ] ${idx + 1}. ${item}`).join('\n')}
`
    : ''
}
=====================================================
Vision: To provide valuable Apostolic and prophetic resources for kingdom building in the 21st century.
Mission: Helping the younger generation of fivefold ministry builders avoid delays and build accurately.
Website: S.M.A.R.T Portal | Nicholas Dlamini
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${teaching.title.replace(/[^a-zA-Z0-9]/g, '_')}_Apostle_Nicholas.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedIds((prev) => ({ ...prev, [teaching.id]: true }));
    setTimeout(() => {
      setDownloadedIds((prev) => ({ ...prev, [teaching.id]: false }));
    }, 3000);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Apostolic & Prophetic Vault
          </span>
          <h2 className="text-3xl font-cinzel font-bold text-white mt-1">
            Sound Doctrine & Reformation Teachings
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Access in-depth audio sermons, video masterclasses, and printable study monographs designed to prevent ministry delays and align fivefold leaders.
          </p>
        </div>

        {/* Live Filter Counter */}
        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-amber-400 font-bold">{filteredTeachings.length}</span> of{' '}
          {teachings.length} kingdom resources
        </div>
      </div>

      {/* Official YouTube Channel Banner */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border border-red-800/40 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-red-950/50">
            <svg className="w-7 h-7 fill-current text-red-500" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
                Official YouTube Channel
              </span>
              <span className="text-xs text-slate-400 font-mono">{YOUTUBE_CHANNEL_HANDLE}</span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mt-1">
              {YOUTUBE_CHANNEL_NAME}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Watch full apostolic sermons, live impartations, 40 Days in the Word series, and prophetic masterclasses directly on YouTube.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setFormatFilter('video')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-xs text-slate-200 hover:text-white font-medium transition-colors"
          >
            Filter Video Teachings
          </button>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition-all"
          >
            <span>Subscribe & Watch</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Control Strip: Search & Filter Tabs */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search teachings, scriptures (e.g. 1 Cor 3:10), or ministry traps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Format Tabs (Interactive segmented buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setFormatFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                formatFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setFormatFilter('audio')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                formatFilter === 'audio'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Audio</span>
            </button>
            <button
              onClick={() => setFormatFilter('video')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                formatFilter === 'video'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
            <button
              onClick={() => setFormatFilter('pdf')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                formatFilter === 'pdf'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF / Notes</span>
            </button>
          </div>
        </div>

        {/* Category Pills (Button filters) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 flex items-center gap-1 shrink-0 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" /> Topics:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-600/50 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Fivefold Topics' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Teachings Grid */}
      {filteredTeachings.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800">
          <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No resources found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or switching to another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFormatFilter('all');
              setCategoryFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachings.map((teaching) => {
            const isPlaying = activeAudioId === teaching.id;
            const isBookmarked = bookmarkedIds.includes(teaching.id);

            return (
              <div
                key={teaching.id}
                className="flex flex-col justify-between rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-600/40 transition-all p-6 shadow-lg shadow-black/20 relative"
              >
                <div>
                  {/* Metadata Row with Bookmark Button */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-400">{teaching.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{teaching.format}</span>
                      <span aria-hidden="true">·</span>
                      <span>{teaching.duration}</span>
                    </div>

                    {/* Bookmark Toggle Action */}
                    {onToggleBookmark && (
                      <button
                        onClick={() => onToggleBookmark(teaching.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                        title={isBookmarked ? 'Remove from My Library' : 'Bookmark to My Library'}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                    {teaching.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs text-slate-300 font-editorial italic mt-1.5 line-clamp-2">
                    "{teaching.subtitle}"
                  </p>

                  {/* Scriptures */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-mono text-amber-300/90">
                    {teaching.scriptures.map((scrip) => (
                      <span key={scrip} className="bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
                        {scrip}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {teaching.description}
                  </p>

                  {/* Key Revelation highlights */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Key Apostolic Anchor
                    </div>
                    <div className="text-xs text-slate-300 italic line-clamp-2">
                      "{teaching.keyRevelations[0]}"
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  {/* Primary format action */}
                  {teaching.format === 'audio' && (
                    <button
                      onClick={() => onPlayAudio(teaching)}
                      className={`flex-1 px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                        isPlaying
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-900/40 animate-pulse font-bold'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>{isPlaying ? 'Playing Sermon...' : 'Play Audio'}</span>
                    </button>
                  )}

                  {(teaching.format === 'video' || Boolean(teaching.youtubeUrl)) && (
                    <button
                      onClick={() => onOpenVideo(teaching)}
                      className="flex-1 px-3.5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Watch YouTube Sermon</span>
                    </button>
                  )}

                  {teaching.format === 'pdf' && (
                    <button
                      onClick={() => onOpenPdf(teaching)}
                      className="flex-1 px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Monograph</span>
                    </button>
                  )}

                  {/* Download Notes Action */}
                  <button
                    onClick={() => handleDownload(teaching)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                    title="Download Notes & Monograph Outline"
                  >
                    {downloadedIds[teaching.id] ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
