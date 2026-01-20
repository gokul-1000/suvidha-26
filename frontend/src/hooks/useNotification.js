import { useState } from "react";

/**
 * useNotification Hook
 * Provides success, error, info notifications
 * Auto-dismiss after timeout
 */

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (
    message,
    type = "info",
    duration = 3000
  ) => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  return {
    notification,
    showSuccess: (msg, duration) =>
      showNotification(msg, "success", duration),

    showError: (msg, duration) =>
      showNotification(msg, "error", duration),

    showInfo: (msg, duration) =>
      showNotification(msg, "info", duration),
  };
};
