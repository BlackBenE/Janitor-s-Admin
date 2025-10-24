// Exemples d'utilisation du composant GenericTabs pour d'autres entités

import { TabConfig } from "../shared/GenericTabs";
import {
  EventAvailable as BookingIcon,
  Build as ServiceIcon,
  Payment as PaymentIcon,
  Assignment as TaskIcon,
  Notifications as NotificationIcon,
} from "@mui/icons-material";

// Configuration pour les réservations (bookings)
export const bookingTabConfigs: TabConfig<string>[] = [
  {
    key: "all",
    label: "All Bookings",
    icon: BookingIcon,
    color: "default",
    description: "Toutes les réservations",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: BookingIcon,
    color: "success",
    description: "Réservations confirmées",
  },
  {
    key: "pending",
    label: "Pending",
    icon: BookingIcon,
    color: "warning",
    description: "En attente de confirmation",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: BookingIcon,
    color: "error",
    description: "Réservations annulées",
  },
  {
    key: "completed",
    label: "Completed",
    icon: BookingIcon,
    color: "info",
    description: "Réservations terminées",
  },
];

// Configuration pour les services
export const serviceTabConfigs: TabConfig<string>[] = [
  {
    key: "all",
    label: "All Services",
    icon: ServiceIcon,
    color: "default",
  },
  {
    key: "available",
    label: "Available",
    icon: ServiceIcon,
    color: "success",
  },
  {
    key: "busy",
    label: "Busy",
    icon: ServiceIcon,
    color: "warning",
  },
  {
    key: "offline",
    label: "Offline",
    icon: ServiceIcon,
    color: "error",
  },
];

// Configuration pour les paiements
export const paymentTabConfigs: TabConfig<string>[] = [
  {
    key: "all",
    label: "All Payments",
    icon: PaymentIcon,
    color: "default",
  },
  {
    key: "successful",
    label: "Successful",
    icon: PaymentIcon,
    color: "success",
  },
  {
    key: "pending",
    label: "Pending",
    icon: PaymentIcon,
    color: "warning",
  },
  {
    key: "failed",
    label: "Failed",
    icon: PaymentIcon,
    color: "error",
  },
  {
    key: "refunded",
    label: "Refunded",
    icon: PaymentIcon,
    color: "info",
  },
];

// Fonctions de comptage pour les réservations
export const getBookingCount = (tabKey: string, bookings: any[]): number => {
  if (tabKey === "all") {
    return bookings.length;
  }
  return bookings.filter((booking) => booking.status === tabKey).length;
};

// Fonctions de comptage pour les services
export const getServiceCount = (tabKey: string, services: any[]): number => {
  if (tabKey === "all") {
    return services.length;
  }
  return services.filter((service) => service.availability === tabKey).length;
};

// Fonctions de comptage pour les paiements
export const getPaymentCount = (tabKey: string, payments: any[]): number => {
  if (tabKey === "all") {
    return payments.length;
  }
  return payments.filter((payment) => payment.status === tabKey).length;
};

/*
Usage examples:

// For bookings:
<GenericTabs<BookingType, string>
  activeTab={activeBookingTab}
  items={bookings}
  tabConfigs={bookingTabConfigs}
  onTabChange={handleBookingTabChange}
  getItemCount={getBookingCount}
  ariaLabel="booking status filter"
/>

// For services:
<GenericTabs<ServiceType, string>
  activeTab={activeServiceTab}
  items={services}
  tabConfigs={serviceTabConfigs}
  onTabChange={handleServiceTabChange}
  getItemCount={getServiceCount}
  ariaLabel="service availability filter"
/>

// For payments:
<GenericTabs<PaymentType, string>
  activeTab={activePaymentTab}
  items={payments}
  tabConfigs={paymentTabConfigs}
  onTabChange={handlePaymentTabChange}
  getItemCount={getPaymentCount}
  ariaLabel="payment status filter"
/>
*/
