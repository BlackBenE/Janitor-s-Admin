import { useState, useCallback } from "react";

export interface NotificationState {
  message: string;
  type: "success" | "error" | "warning" | "info";
  open: boolean;
  duration?: number;
}

export const useUINotifications = () => {
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "info",
    open: false,
    duration: 6000,
  });

  const showNotification = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info",
      duration = 6000
    ) => {
      setNotification({
        message,
        type,
        open: true,
        duration,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showNotification(message, "success", duration);
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showNotification(message, "error", duration);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showNotification(message, "warning", duration);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showNotification(message, "info", duration);
    },
    [showNotification]
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };
};
