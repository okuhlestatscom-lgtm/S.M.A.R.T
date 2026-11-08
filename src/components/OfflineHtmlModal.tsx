import React, { useState } from 'react';
import { Download, ExternalLink, Copy, Check, FileCode, X, Sparkles, Smartphone, Laptop, HardDrive } from 'lucide-react';
import { downloadOfflineHtmlService } from '../services/downloadOfflineHtmlService';

interface OfflineHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const OfflineHtmlModal: React.FC<OfflineHtmlModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    await downloadOfflineHtmlService.downloadStandaloneHtml('SMART_Portal_Nicholas_Dlamini_Offline.html');
    setIsDownloading(false);
    onShowToast('HTML file download started! Check your browser downloads folder.');
  };

  const handleCopyCode = async () => {
    try {
      const response = await fetch('/smart-portal-offline.html');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onShowToast('Complete standalone HTML code copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      onShowToast('Failed to copy. Try clicking Download HTML File instead.');
    }
  };

  const handleOpenTab = () => {
    window.open('/smart-portal-offline.html', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Single-File Offline Application</span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white leading-tight">
                Downloadable Offline HTML Portal
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                File: <code className="text-amber-300 font-mono">smart-portal-offline.html</code> (~34 KB)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Main Download Action Strip */}
          <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-4">
            <div>
              <h4 className="font-cinzel text-base font-bold text-white mb-1">
                Your Offline S.M.A.R.T. App is Ready
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                This single HTML file contains Apostle Nicholas Dlamini's full ministerial library: all 11 books, physical print pricing, Books2Read universal digital links, teachings across Audio/Video/PDF, the 5 content categories, dynamic #tag filtering, sample chapter reader, and an offline prayer journal with local browser saving.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Downloading...' : 'Download HTML File Now'}</span>
              </button>

              <button
                onClick={handleOpenTab}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in New Browser Tab</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px] text-slate-400">
              <span>Saved name: <strong className="text-slate-200 font-mono">SMART_Portal_Nicholas_Dlamini_Offline.html</strong></span>
              <button
                onClick={handleCopyCode}
                className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied HTML Code!' : 'Copy Raw HTML Source'}</span>
              </button>
            </div>
          </div>

          {/* How to use */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              How To Use Offline on Any Device
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <Laptop className="w-4 h-4" />
                  <span>PC & Mac</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Save to your Desktop, Documents, or Downloads folder. Double-click to launch in Chrome, Safari, or Edge.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Phone & Tablet</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Save file to Files app. Tap to open in Safari or Chrome. Fully responsive for mobile ministry.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <HardDrive className="w-4 h-4" />
                  <span>USB / Drive</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Copy to any flash drive or external drive to distribute apostolic teachings in zero-internet rural hubs.
                </p>
              </div>
            </div>
          </div>

          {/* Quick summary of contents */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="text-slate-300 font-semibold">Included in the HTML file:</div>
            <div className="flex flex-wrap gap-2 text-[10px] text-amber-300 font-mono pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">✓ 11 Published Books</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">✓ Audio & Video Sermons</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">✓ PDF Study Monograph</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">✓ Dynamic #Tag Filters</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">✓ Offline Prayer Journal</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">✓ WhatsApp Ordering</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Apostle Nicholas Dlamini · S.M.A.R.T Offline Portal
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
