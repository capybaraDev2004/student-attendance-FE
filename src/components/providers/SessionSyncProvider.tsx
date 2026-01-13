'use client';

import { useSessionSync } from '@/lib/useSessionSync';

/**
 * Component để tự động đồng bộ session với account_status từ API real-time
 * Component này không render gì, chỉ chạy logic sync trong background
 */
export default function SessionSyncProvider() {
  useSessionSync();
  return null;
}
