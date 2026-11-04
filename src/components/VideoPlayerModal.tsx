import React, { useState } from 'react';
import { X, Play, Volume2, Sparkles, Clock, BookOpen, ExternalLink, Radio, Check } from 'lucide-react';
import { Teaching, extractYouTubeVideoId } from '../data/smartData';

interface VideoPlayerModalProps {
  teaching: Teaching | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  teaching,
  onClose,
}) => {
  const [activeTimestampSeconds, setActiveTimestampSeconds] = useState<number | null>(null);

  if (!teaching) return null;

  // Extract YouTube ID from youtubeUrl, youtubeVideoId, or videoDetails.embedId
  const rawId = teaching.youtubeVideoId || teaching.youtubeUrl || teaching.videoDetails?.embedId || '';
  const youtubeId = extractYouTubeVideoId(rawId) || (rawId.length === 11 ? rawId : '');

  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const embedUrl = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1${
        activeTimestampSeconds !== null ? `&start=${activeTimestampSeconds}` : ''
      }`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            {/* YouTube Red Icon Badge */}
            <div className="w-7 h-5 rounded bg-red-600 flex items-center justify-center shadow shrink-0">
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono block">
                Apostolic Video Sermon · {teaching.category}
              </span>
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-lg">
                {teaching.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-700/50 text-red-300 hover:text-white hover:bg-red-900/60 text-xs font-semibold transition-colors"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Frame */}
        <div className="relative aspect-video bg-black w-full overflow-hidden flex items-center justify-center">
          {embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={teaching.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            /* Fallback cinematic preview if no YouTube ID provided */
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src="/src/assets/images/hero_apostolic_assembly_1793484734951.jpg"
                alt="Apostolic Teaching Session"
                className="w-full h-full object-cover opacity-60"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl shadow-red-950/80">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <div>
                  <h4 className="font-cinzel text-lg font-bold text-white">
                    {teaching.title}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mt-1">
                    Preached by Apostle Nicholas Dlamini. You can paste your direct YouTube sermon link in the Admin Backend to stream live here!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes & Timestamp Navigation Drawer */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-slate-950/80">
          {/* Chapter / Timestamp Links */}
          {teaching.videoDetails?.timestamps && teaching.videoDetails.timestamps.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Jump to Sermon Chapter:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {teaching.videoDetails.timestamps.map((item, idx) => {
                  const seconds = parseTimeToSeconds(item.time);
                  const isSelected = activeTimestampSeconds === seconds;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTimestampSeconds(seconds)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors font-mono flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold shadow'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{item.time}</span>
                      <span className="text-[11px] opacity-80">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono mb-1">
              Core Scriptural Foundations:
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-300">
              {teaching.scriptures.map((s) => (
                <span key={s} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono mb-1">
              Apostolic Revelations Taught in this Session:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {teaching.keyRevelations.map((rev, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-mono">▸</span>
                  <span>{rev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
