import React, { useState, useEffect } from 'react';
import { Play, Pause, X, Volume2, VolumeX, FastForward, Headphones, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import { Teaching } from '../data/smartData';
import { soundEffects } from '../services/soundEffects';

interface StickyAudioPlayerProps {
  teaching: Teaching | null;
  onClose: () => void;
}

export const StickyAudioPlayer: React.FC<StickyAudioPlayerProps> = ({
  teaching,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const duration = teaching?.audioDurationSeconds || 3120; // Default ~52 mins

  useEffect(() => {
    if (teaching && isPlaying) {
      soundEffects.startAmbientSermonAudio(isMuted ? 0 : volume);
    } else {
      soundEffects.stopAmbientSermonAudio();
    }

    return () => {
      soundEffects.stopAmbientSermonAudio();
    };
  }, [teaching, isPlaying, volume, isMuted]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 1 * playbackSpeed));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, duration]);

  if (!teaching) return null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedCycle = () => {
    if (playbackSpeed === 1) setPlaybackSpeed(1.25);
    else if (playbackSpeed === 1.25) setPlaybackSpeed(1.5);
    else setPlaybackSpeed(1);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#0b0f17]/95 border-t border-amber-600/40 backdrop-blur-md shadow-2xl">
      
      {/* Collapsible Notes Drawer */}
      {showNotes && (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-950/90 border-b border-slate-800 text-xs text-slate-300 max-h-60 overflow-y-auto animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="font-cinzel font-bold text-white uppercase tracking-wider text-xs">
              Sermon Notes & Scripture Anchors
            </span>
            <span className="text-amber-400 font-mono text-[11px]">{teaching.category}</span>
          </div>
          <p className="italic text-slate-300 mb-3 font-editorial">
            "{teaching.description}"
          </p>
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-400 block font-mono text-[11px]">Key Apostolic Revelation:</span>
            {teaching.keyRevelations.map((rev, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-200">
                <span className="text-amber-400">▸</span>
                <span>{rev}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Player Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Teaching Info */}
        <div className="flex items-center gap-3 min-w-0 max-w-xs sm:max-w-md">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              {teaching.title}
            </h4>
            <p className="text-[11px] text-amber-300/80 truncate font-mono">
              {teaching.author} · {teaching.scriptures.join(', ')}
            </p>
          </div>
        </div>

        {/* Center: Playback Controls & Progress */}
        <div className="flex-1 max-w-xl hidden md:flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            {/* Speed Button */}
            <button
              onClick={handleSpeedCycle}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
              title="Playback speed"
            >
              {playbackSpeed}x
            </button>

            {/* Play / Pause Button */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
            </button>

            {/* Notes drawer toggle */}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1"
              title="Toggle sermon notes"
            >
              <FileText className="w-3.5 h-3.5" />
              {showNotes ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="w-full flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Close */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Play / Pause */}
          <button
            onClick={togglePlay}
            className="md:hidden w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />}
          </button>

          {/* Volume Control (Desktop) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 h-1 bg-slate-800 rounded appearance-none accent-amber-500"
            />
          </div>

          {/* Close Player */}
          <button
            onClick={() => {
              soundEffects.stopAmbientSermonAudio();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close audio player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
