import React, { useState } from 'react';
import { Download, Smartphone, X, Check, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'badge' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'nav',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 3000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'badge') {
      return (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold transition-all shadow-sm ${className}`}
          title="Install S.M.A.R.T App for full offline access"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App for Offline Access</span>
        </button>
      );
    }

    if (variant === 'full') {
      return (
        <button
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all ${className}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Install S.M.A.R.T App on Home Screen</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/40 text-[11px] font-bold transition-all shadow-sm ${className}`}
        title="Install as Progressive Web App"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow (WebKit beforeinstallprompt fallback)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors ${className}`}
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="font-cinzel text-sm font-bold text-white">
                    Install on iPhone / iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> button (box with an upward arrow) in the Safari bottom toolbar.
                  </span>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <span>
                    Scroll down and select <strong>Add to Home Screen</strong>.
                  </span>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> in the top right corner. The S.M.A.R.T app icon will appear on your home screen for one-tap offline study!
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
