import { useState, useEffect } from 'react';
import { offlineCacheService } from '../services/offlineCacheService';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => offlineCacheService.isOnline());

  useEffect(() => {
    const unsubscribe = offlineCacheService.subscribeOnlineStatus((online) => {
      setIsOnline(online);
    });
    return unsubscribe;
  }, []);

  return isOnline;
}
