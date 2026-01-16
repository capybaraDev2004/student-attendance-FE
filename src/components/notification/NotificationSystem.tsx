"use client";

import { useEffect, useState } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // milliseconds, default 3000
}

let notificationIdCounter = 0;
const notificationListeners: Array<(notifications: Notification[]) => void> = [];
let notifications: Notification[] = [];

const notify = (notification: Omit<Notification, "id">) => {
  const id = `notification-${++notificationIdCounter}`;
  const newNotification: Notification = {
    ...notification,
    id,
    duration: notification.duration ?? 3000,
  };

  notifications = [...notifications, newNotification];
  notificationListeners.forEach((listener) => listener([...notifications]));

  // Auto remove after duration
  if (newNotification.duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);
  }
};

const removeNotification = (id: string) => {
  notifications = notifications.filter((n) => n.id !== id);
  notificationListeners.forEach((listener) => listener([...notifications]));
};

// Export functions for use in other components
export const showNotification = notify;
export const hideNotification = removeNotification;

export default function NotificationSystem() {
  const [currentNotifications, setCurrentNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const listener = (newNotifications: Notification[]) => {
      setCurrentNotifications(newNotifications);
    };

    notificationListeners.push(listener);
    setCurrentNotifications([...notifications]);

    return () => {
      const index = notificationListeners.indexOf(listener);
      if (index > -1) {
        notificationListeners.splice(index, 1);
      }
    };
  }, []);

  if (currentNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full sm:max-w-sm">
      {currentNotifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          index={index}
        />
      ))}
    </div>
  );
}

function NotificationItem({
  notification,
  index,
}: {
  notification: Notification;
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      hideNotification(notification.id);
    }, 300);
  };

  const getNotificationStyles = () => {
    const baseStyles = "pointer-events-auto rounded-2xl shadow-2xl border-2 backdrop-blur-md overflow-hidden transform transition-all duration-300 ease-out";
    
    switch (notification.type) {
      case "success":
        return `${baseStyles} bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-emerald-300/80 text-emerald-900`;
      case "error":
        return `${baseStyles} bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 border-rose-300/80 text-rose-900`;
      case "warning":
        return `${baseStyles} bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-amber-300/80 text-amber-900`;
      case "info":
        return `${baseStyles} bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 border-blue-300/80 text-blue-900`;
      default:
        return `${baseStyles} bg-white border-slate-300 text-slate-900`;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case "info":
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div
      className={`${getNotificationStyles()} ${
        isVisible && !isExiting
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine pointer-events-none" />
      
      <div className="relative p-4 flex items-start gap-3">
        {/* Icon */}
        {getIcon()}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-bold text-base mb-0.5 leading-tight">
                {notification.title}
              </h4>
              {notification.message && (
                <p className="text-sm opacity-90 leading-relaxed mt-1">
                  {notification.message}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors group"
              aria-label="Đóng thông báo"
            >
              <svg
                className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {notification.duration && notification.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-current to-current opacity-30 animate-progress-bar"
            style={{
              animationDuration: `${notification.duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}
