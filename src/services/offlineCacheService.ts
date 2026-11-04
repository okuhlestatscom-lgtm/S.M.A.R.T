import { Teaching, Book, JournalEntry } from '../data/smartData';

const CACHE_NAME = 'smart-library-vault-v1';
const OFFLINE_SYNC_KEY = 'smart_offline_vault_synced_at';

export interface OfflineCacheStats {
  isSupported: boolean;
  cachedCount: number;
  lastSyncedAt: string | null;
  isOnline: boolean;
}

class OfflineCacheService {
  private onlineListeners: Set<(isOnline: boolean) => void> = new Set();
  private isOnlineStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  private handleOnline = () => {
    this.isOnlineStatus = true;
    this.notifyListeners();
  };

  private handleOffline = () => {
    this.isOnlineStatus = false;
    this.notifyListeners();
  };

  private notifyListeners() {
    this.onlineListeners.forEach((listener) => listener(this.isOnlineStatus));
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : this.isOnlineStatus;
  }

  public subscribeOnlineStatus(listener: (isOnline: boolean) => void): () => void {
    this.onlineListeners.add(listener);
    listener(this.isOnline());
    return () => {
      this.onlineListeners.delete(listener);
    };
  }

  /**
   * Caches a single URL (e.g. book cover, poster, or local asset) into CacheStorage.
   */
  public async cacheAsset(url?: string): Promise<boolean> {
    if (!url || typeof window === 'undefined' || !('caches' in window)) return false;
    // Don't try to fetch data: or blob: URLs with Cache API, as they are already local/in-memory
    if (url.startsWith('data:') || url.startsWith('blob:')) return true;

    try {
      const cache = await caches.open(CACHE_NAME);
      const matched = await cache.match(url);
      if (matched) return true;

      const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
      if (response.ok || response.type === 'opaque') {
        await cache.put(url, response);
        return true;
      }
      return false;
    } catch {
      // Fetch or cache failed, likely already offline or cross-origin restricted
      return false;
    }
  }

  /**
   * Pre-caches all images, sample chapters, and resources for saved library items.
   */
  public async precacheAllLibraryItems(
    savedTeachings: Teaching[],
    savedBooks: Book[],
    _journalEntries: JournalEntry[] = []
  ): Promise<{ success: boolean; cachedCount: number; message: string }> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return {
        success: false,
        cachedCount: 0,
        message: 'Offline CacheStorage is not supported in this browser environment.'
      };
    }

    const urlsToCache = new Set<string>();

    // Canonical app icons and logo
    urlsToCache.add('/pwa-192x192.png');
    urlsToCache.add('/pwa-512x512.png');
    urlsToCache.add('/apple-touch-icon.png');
    urlsToCache.add('/assets/aistudio/file_000000007c2c8208b2cc5202023513b7_3aeb00d7.png');
    urlsToCache.add('/assets/aistudio/FB_IMG_1793479262926_b609c63e.jpg');

    // Saved Books Covers
    savedBooks.forEach((book) => {
      if (book.coverImage && !book.coverImage.startsWith('data:') && !book.coverImage.startsWith('blob:')) {
        urlsToCache.add(book.coverImage);
      }
    });

    // Saved Teachings audio/assets if available
    savedTeachings.forEach((teaching) => {
      if (teaching.audioUrl && !teaching.audioUrl.startsWith('http')) {
        urlsToCache.add(teaching.audioUrl);
      }
    });

    // Saved Books PDF Downloads if available
    savedBooks.forEach((book) => {
      if (book.pdfDownloadUrl && !book.pdfDownloadUrl.startsWith('http')) {
        urlsToCache.add(book.pdfDownloadUrl);
      }
    });

    let successCount = 0;
    try {
      const cache = await caches.open(CACHE_NAME);
      const urlList = Array.from(urlsToCache);

      await Promise.allSettled(
        urlList.map(async (url) => {
          try {
            const existing = await cache.match(url);
            if (!existing) {
              const res = await fetch(url, { mode: 'no-cors' });
              if (res) {
                await cache.put(url, res);
                successCount++;
              }
            } else {
              successCount++;
            }
          } catch {
            // Ignore individual fetch failure
          }
        })
      );

      const now = new Date().toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      localStorage.setItem(OFFLINE_SYNC_KEY, now);

      return {
        success: true,
        cachedCount: successCount,
        message: `Successfully synchronized ${successCount} library assets for offline study.`
      };
    } catch {
      return {
        success: false,
        cachedCount: successCount,
        message: 'Partial offline synchronization completed.'
      };
    }
  }

  /**
   * Retrieves current stats about offline readiness
   */
  public async getStats(): Promise<OfflineCacheStats> {
    const isSupported = typeof window !== 'undefined' && 'caches' in window;
    let cachedCount = 0;

    if (isSupported) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        cachedCount = keys.length;
      } catch {
        cachedCount = 0;
      }
    }

    const lastSyncedAt = typeof localStorage !== 'undefined'
      ? localStorage.getItem(OFFLINE_SYNC_KEY)
      : null;

    return {
      isSupported,
      cachedCount,
      lastSyncedAt,
      isOnline: this.isOnline()
    };
  }

  /**
   * Purge outdated offline cache if needed
   */
  public async clearCache(): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) return false;
    try {
      await caches.delete(CACHE_NAME);
      localStorage.removeItem(OFFLINE_SYNC_KEY);
      return true;
    } catch {
      return false;
    }
  }
}

export const offlineCacheService = new OfflineCacheService();
