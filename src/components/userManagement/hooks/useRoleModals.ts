import { useState, useCallback } from "react";

interface RoleModalState {
  open: boolean;
  userId: string;
  userName: string;
}

export const useRoleModals = () => {
  const [bookingsModal, setBookingsModal] = useState<RoleModalState>({
    open: false,
    userId: "",
    userName: "",
  });

  const [subscriptionModal, setSubscriptionModal] = useState<RoleModalState>({
    open: false,
    userId: "",
    userName: "",
  });

  const [servicesModal, setServicesModal] = useState<RoleModalState>({
    open: false,
    userId: "",
    userName: "",
  });

  const openBookingsModal = useCallback((userId: string, userName: string) => {
    setBookingsModal({ open: true, userId, userName });
  }, []);

  const closeBookingsModal = useCallback(() => {
    setBookingsModal({ open: false, userId: "", userName: "" });
  }, []);

  const openSubscriptionModal = useCallback(
    (userId: string, userName: string) => {
      setSubscriptionModal({ open: true, userId, userName });
    },
    []
  );

  const closeSubscriptionModal = useCallback(() => {
    setSubscriptionModal({ open: false, userId: "", userName: "" });
  }, []);

  const openServicesModal = useCallback((userId: string, userName: string) => {
    setServicesModal({ open: true, userId, userName });
  }, []);

  const closeServicesModal = useCallback(() => {
    setServicesModal({ open: false, userId: "", userName: "" });
  }, []);

  return {
    bookingsModal,
    subscriptionModal,
    servicesModal,
    openBookingsModal,
    closeBookingsModal,
    openSubscriptionModal,
    closeSubscriptionModal,
    openServicesModal,
    closeServicesModal,
  };
};
