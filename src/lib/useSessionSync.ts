import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiFetch } from './api';

/**
 * Hook để tự động đồng bộ session với account_status từ API real-time
 * Sẽ check và update session mỗi khi có thay đổi account_status
 * Chỉ check khi tab đang active để tiết kiệm tài nguyên
 */
export function useSessionSync() {
  const { data: session, status, update } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const lastAccountStatusRef = useRef<string | undefined>(session?.user?.account_status);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    // Track tab visibility để chỉ check khi tab đang active
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Chỉ chạy khi đã authenticated và tab đang active
    if (status !== 'authenticated' || !accessToken || !isTabActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Check account_status từ API
    const checkAndUpdateSession = async () => {
      // Chỉ check khi tab đang active
      if (document.hidden) return;

      try {
        const profileData = await apiFetch<{ account_status: string }>('/profile', {
          authToken: accessToken,
        });

        // Chỉ update session khi account_status thực sự thay đổi
        if (
          profileData.account_status &&
          profileData.account_status !== lastAccountStatusRef.current
        ) {
          lastAccountStatusRef.current = profileData.account_status;
          await update({
            account_status: profileData.account_status,
          });
        }
      } catch (error) {
        // Silent fail - không log error để tránh spam console
        console.debug('Session sync check failed:', error);
      }
    };

    // Chạy ngay lập tức một lần
    checkAndUpdateSession();

    // Sau đó check mỗi 10 giây (giảm tần suất để giảm load)
    intervalRef.current = setInterval(checkAndUpdateSession, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, accessToken, update, isTabActive]);

  return { session, status };
}
