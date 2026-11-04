import React, { useState } from 'react';
import { WifiOff, BookOpen, Check, X, ShieldAlert } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  onNavigateToLibrary?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onNavigateToLibrary }) => {
  const isOnline = useOnlineStatus();
  const [isDismissed, setIsDismissed] = useState(false);

  // When back online, reset dismissal state
  React.useEffect(() => {
    if (isOnline) {
      setIsDismissed(false);
    }
  }, [isOnline]);

  if (isOnline || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fadeIn">
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/95 border border-amber-500/50 shadow-2xl backdrop-blur-md flex items-start gap-3 text-xs">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
          <WifiOff className="w-4 h-4 animate-pulse" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span>Offline Mode Active</span>
            <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
              Vault Ready
            </span>
          </div>
          <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
            No internet connection detected. Your bookmarked teachings, book chapters, and prayer journal remain fully accessible.
          </p>

          {onNavigateToLibrary && (
            <button
              onClick={onNavigateToLibrary}
              className="mt-2 text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open My Library Offline Vault →</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Dismiss offline banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
