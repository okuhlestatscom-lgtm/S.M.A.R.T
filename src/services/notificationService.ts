/**
 * Web Push Notifications & Follower Alert Service
 * Handles browser push permissions, sound alerts, and notification dispatches
 */
import { soundEffects } from './soundEffects';
import { NotificationItem } from '../data/smartData';

export interface PushPreferences {
  enabled: boolean;
  reportsAndAnnouncements: boolean;
  liveBroadcasts: boolean;
  newTeachings: boolean;
  bookReleases: boolean;
  permissionStatus: NotificationPermission;
}

const STORAGE_KEY = 'smart_push_preferences_v1';

class NotificationService {
  private preferences: PushPreferences = {
    enabled: false,
    reportsAndAnnouncements: true,
    liveBroadcasts: true,
    newTeachings: true,
    bookReleases: true,
    permissionStatus: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  };

  constructor() {
    this.loadPreferences();
  }

  private loadPreferences() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.preferences = { ...this.preferences, ...JSON.parse(raw) };
      }
      if (typeof window !== 'undefined' && 'Notification' in window) {
        this.preferences.permissionStatus = Notification.permission;
        if (Notification.permission === 'granted') {
          this.preferences.enabled = true;
        }
      }
    } catch {
      // safe fallback
    }
  }

  getPreferences(): PushPreferences {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.preferences.permissionStatus = Notification.permission;
    }
    return { ...this.preferences };
  }

  savePreferences(prefs: Partial<PushPreferences>) {
    this.preferences = { ...this.preferences, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
  }

  /**
   * Request native browser push permission
   */
  async requestPushPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.preferences.permissionStatus = permission;
      const granted = permission === 'granted';
      this.preferences.enabled = granted;
      this.savePreferences(this.preferences);

      if (granted) {
        soundEffects.playAlertChime();
        this.sendNativeNotification({
          id: 'welcome-push',
          title: '🔥 S.M.A.R.T Push Notifications Enabled!',
          message: 'You will receive immediate alerts when Apostle Nicholas Dlamini publishes reports, books, or goes live.',
          timestamp: 'Just now',
          type: 'announcement',
          read: false
        });
      }
      return granted;
    } catch (err) {
      console.warn('Notification permission error', err);
      return false;
    }
  }

  /**
   * Send a system notification and play herald chime
   */
  sendNativeNotification(item: NotificationItem) {
    soundEffects.playAlertChime();

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notifOptions: NotificationOptions = {
          body: item.message,
          icon: item.imageUrl || '/assets/aistudio/file_000000007c2c8208b2cc5202023513b7_3aeb00d7.png',
          badge: '/assets/aistudio/file_000000007c2c8208b2cc5202023513b7_3aeb00d7.png',
          tag: item.id,
          // Support rich poster / book cover preview on compatible platforms
          ...(item.imageUrl ? { image: item.imageUrl } : {})
        };

        const notif = new Notification(item.title, notifOptions);

        notif.onclick = () => {
          window.focus();
        };
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }
  }
}

export const notificationService = new NotificationService();
