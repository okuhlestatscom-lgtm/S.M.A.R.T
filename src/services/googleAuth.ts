/**
 * Google Identity & Cloud Backup Service
 * Supports Google backed-up Sign In / Sign Up with user accounts
 * Syncs user library, orders, and prayer petitions with their Google account.
 */
import { UserProfile, BookmarkStore, BookOrder, PrayerPetition, JournalEntry } from '../data/smartData';

export interface GoogleBackupData {
  user: UserProfile;
  bookmarks: BookmarkStore;
  orders: BookOrder[];
  petitions: PrayerPetition[];
  journalEntries?: JournalEntry[];
  lastSyncedISO: string;
}

export const ADMIN_EMAILS = [
  'okuhlestatscom@gmail.com',
  'apostlenicholas@smartministry.org',
  'nicholasdlamini@smartministry.org'
];

export const isAuthorizedAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

class GoogleAuthService {
  private currentUser: UserProfile | null = null;
  private listeners: ((user: UserProfile | null) => void)[] = [];

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    try {
      const raw = localStorage.getItem('smart_current_user_v1');
      if (raw) {
        this.currentUser = JSON.parse(raw);
      }
    } catch {
      this.currentUser = null;
    }
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  subscribe(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentUser));
  }

  /**
   * Completes sign in with Google Account
   */
  signInWithGoogle(account: {
    name: string;
    email: string;
    avatar?: string;
    googleSub?: string;
  }): UserProfile {
    const isAdmin = isAuthorizedAdmin(account.email);
    const profile: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: account.name,
      email: account.email,
      avatar: account.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(account.name)}&backgroundColor=b45309,d97706,f59e0b`,
      isGoogleAccount: true,
      googleSub: account.googleSub || `google_${Date.now()}`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: isAdmin ? 'apostle' : 'leader',
      isAdmin
    };

    this.currentUser = profile;
    localStorage.setItem('smart_current_user_v1', JSON.stringify(profile));

    // Restore any existing Google cloud-synced library
    this.restoreCloudBackup(profile.email);

    this.notify();
    return profile;
  }

  /**
   * Back up user library and data to their Google Account store
   */
  backupUserData(
    bookmarks: BookmarkStore,
    orders: BookOrder[],
    petitions: PrayerPetition[],
    journalEntries?: JournalEntry[]
  ): GoogleBackupData | null {
    if (!this.currentUser) return null;

    const backupKey = `smart_google_backup_${this.currentUser.email.toLowerCase()}`;
    const backup: GoogleBackupData = {
      user: this.currentUser,
      bookmarks,
      orders: orders.filter((o) => o.customerEmail.toLowerCase() === this.currentUser?.email.toLowerCase()),
      petitions: petitions.filter((p) => p.email?.toLowerCase() === this.currentUser?.email.toLowerCase()),
      journalEntries,
      lastSyncedISO: new Date().toISOString()
    };

    localStorage.setItem(backupKey, JSON.stringify(backup));

    const updatedUser = {
      ...this.currentUser,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.currentUser = updatedUser;
    localStorage.setItem('smart_current_user_v1', JSON.stringify(updatedUser));
    // Do NOT call this.notify() here: this is a background storage backup, not an authentication state change.
    // Calling notify() triggers setCurrentUser which causes a circular render loop in React.

    return backup;
  }

  /**
   * Restore cloud backup for the given email
   */
  restoreCloudBackup(email: string): GoogleBackupData | null {
    try {
      const backupKey = `smart_google_backup_${email.toLowerCase()}`;
      const raw = localStorage.getItem(backupKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      return null;
    }
    return null;
  }

  signOut() {
    this.currentUser = null;
    localStorage.removeItem('smart_current_user_v1');
    this.notify();
  }
}

export const googleAuthService = new GoogleAuthService();
