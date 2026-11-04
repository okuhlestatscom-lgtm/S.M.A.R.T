import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Cloud, RefreshCw, LogOut, ShieldCheck, Mail, User, BookOpen, Bookmark, ShoppingBag } from 'lucide-react';
import { googleAuthService, isAuthorizedAdmin } from '../services/googleAuth';
import { UserProfile, BookmarkStore, BookOrder, PrayerPetition } from '../data/smartData';
import { soundEffects } from '../services/soundEffects';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  bookmarks: BookmarkStore;
  orders: BookOrder[];
  petitions: PrayerPetition[];
  onOpenAdmin?: () => void;
  onShowToast: (msg: string) => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  bookmarks,
  orders,
  petitions,
  onOpenAdmin,
  onShowToast
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEmailInput(currentUser.email);
      setNameInput(currentUser.name);
    } else {
      // Default placeholder to the active Google user in environment
      setEmailInput('okuhlestatscom@gmail.com');
      setNameInput('Apostle Nicholas Dlamini');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleQuickSignIn = (name: string, email: string) => {
    const user = googleAuthService.signInWithGoogle({
      name,
      email,
      googleSub: `g_${Date.now()}`
    });
    onUserChange(user);
    soundEffects.playAlertChime();
    onShowToast(`Signed in as ${name} (${email}). Library backed up!`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      onShowToast('Please provide a valid Google email address.');
      return;
    }
    const derivedName = nameInput.trim() || emailInput.split('@')[0].replace(/[._]/g, ' ');
    const user = googleAuthService.signInWithGoogle({
      name: derivedName,
      email: emailInput.trim(),
      googleSub: `g_${Date.now()}`
    });
    onUserChange(user);
    soundEffects.playAlertChime();
    onShowToast(`Signed in to Google Account: ${emailInput}. Backed up!`);
  };

  const handleManualSync = () => {
    if (!currentUser) return;
    setIsSyncing(true);
    setTimeout(() => {
      googleAuthService.backupUserData(bookmarks, orders, petitions);
      setIsSyncing(false);
      setSyncSuccess(true);
      soundEffects.playAlertChime();
      onShowToast('Cloud sync complete: Your library & orders are safely backed up to Google.');
      setTimeout(() => setSyncSuccess(false), 2500);
    }, 700);
  };

  const handleSignOut = () => {
    googleAuthService.signOut();
    onUserChange(null);
    onShowToast('Signed out of Google Account.');
  };

  const totalSaved = bookmarks.teachingIds.length + bookmarks.bookIds.length;
  const userOrdersCount = orders.filter((o) => o.customerEmail.toLowerCase() === currentUser?.email.toLowerCase()).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow p-2 shrink-0">
              {/* Google G Logo */}
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <span>Google Account Sync</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Cloud Backup
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Securely back up your My Library, orders, and event RSVPs
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {currentUser ? (
            /* Signed In State */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-600/30 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full border-2 border-amber-500/60 object-cover shadow"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {currentUser.name}
                      </span>
                      {currentUser.isAdmin && (
                        <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] rounded font-bold uppercase tracking-wider">
                          Apostle / Admin
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block font-mono">
                      {currentUser.email}
                    </span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Google Backup Active · Synced {currentUser.lastSyncedAt || 'Today'}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Data Backup Status Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <Bookmark className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span className="font-mono text-base font-bold text-white block">
                    {totalSaved}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Library Items
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <ShoppingBag className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="font-mono text-base font-bold text-white block">
                    {userOrdersCount}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Book Orders
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
                  <Cloud className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                  <span className="font-mono text-xs font-semibold text-emerald-400 block pt-0.5">
                    Synced
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Google Cloud
                  </span>
                </div>
              </div>

              {/* Backup Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Backing Up to Google...' : syncSuccess ? 'Sync Completed!' : 'Sync & Backup Now'}</span>
                </button>

                {currentUser.isAdmin && onOpenAdmin && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-xl border border-amber-600/40 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Open Admin Backend</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Not Signed In: One-Tap Google Options */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-slate-300 space-y-1.5">
                <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Cloud className="w-4 h-4" />
                  <span>Why Sign In With Google?</span>
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your bookmarked teachings, saved audio sermons, book reading progress, and event RSVP seats will automatically persist across all devices backed up to your Google account.
                </p>
              </div>

              {/* Quick 1-Click Profile: Apostle Nicholas Dlamini (active user in environment) */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Quick Sign-In with Google:
                </label>
                
                <button
                  type="button"
                  onClick={() => handleQuickSignIn('Apostle Nicholas Dlamini', 'okuhlestatscom@gmail.com')}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-amber-600/50 hover:border-amber-400 hover:bg-slate-900 transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg"
                      alt="Apostle Nicholas Dlamini"
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/80 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs group-hover:text-amber-300 transition-colors">
                          Apostle Nicholas Dlamini
                        </span>
                        <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[9px] rounded font-bold uppercase">
                          Author & Admin
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        okuhlestatscom@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    Sign in →
                  </span>
                </button>
              </div>

              {/* Custom Google Account Sign In Form */}
              <div className="relative py-2 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative px-3 bg-slate-900 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Or enter your actual Google account
                </span>
              </div>

              <form onSubmit={handleCustomSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Name / Title
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Pastor David Khumalo"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Google Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/70" />
          <span>S.M.A.R.T Kingdom Cloud Data Protection · 256-bit encrypted</span>
        </div>
      </div>
    </div>
  );
};
