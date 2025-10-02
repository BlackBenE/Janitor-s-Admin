// Exemple d'utilisation du composant GenericFilters pour d'autres entités

import { FilterConfig } from "../shared/GenericFilters";

// Configuration pour les réservations (bookings)
export const bookingFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "confirmed", label: "Confirmed" },
      { value: "pending", label: "Pending" },
      { value: "cancelled", label: "Cancelled" },
      { value: "completed", label: "Completed" },
    ],
  },
  {
    key: "dateFrom",
    label: "From Date",
    type: "text", // Peut être étendu pour supporter les dates
    placeholder: "From Date",
    hidden: true,
  },
  {
    key: "dateTo",
    label: "To Date",
    type: "text",
    placeholder: "To Date",
    hidden: true,
  },
  {
    key: "minAmount",
    label: "Min Amount",
    type: "number",
    placeholder: "Min Amount",
    minWidth: 100,
    hidden: true,
  },
  {
    key: "maxAmount",
    label: "Max Amount",
    type: "number",
    placeholder: "Max Amount",
    minWidth: 100,
    hidden: true,
  },
];

// Configuration pour les services
export const serviceFilterConfigs: FilterConfig[] = [
  {
    key: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "cleaning", label: "Cleaning" },
      { value: "maintenance", label: "Maintenance" },
      { value: "concierge", label: "Concierge" },
      { value: "transport", label: "Transport" },
    ],
  },
  {
    key: "availability",
    label: "Availability",
    type: "select",
    options: [
      { value: "available", label: "Available" },
      { value: "busy", label: "Busy" },
      { value: "offline", label: "Offline" },
    ],
  },
  {
    key: "location",
    label: "Location",
    type: "text",
    placeholder: "Location",
    hidden: true,
  },
  {
    key: "rating",
    label: "Min Rating",
    type: "number",
    placeholder: "Min Rating (1-5)",
    minWidth: 120,
    hidden: true,
  },
];

// Configuration pour les paiements
export const paymentFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "successful", label: "Successful" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
      { value: "refunded", label: "Refunded" },
    ],
  },
  {
    key: "method",
    label: "Payment Method",
    type: "select",
    hidden: true,
    options: [
      { value: "card", label: "Credit Card" },
      { value: "paypal", label: "PayPal" },
      { value: "bank_transfer", label: "Bank Transfer" },
      { value: "crypto", label: "Cryptocurrency" },
    ],
  },
  {
    key: "currency",
    label: "Currency",
    type: "select",
    hidden: true,
    minWidth: 100,
    options: [
      { value: "EUR", label: "EUR" },
      { value: "USD", label: "USD" },
      { value: "GBP", label: "GBP" },
    ],
  },
  {
    key: "minAmount",
    label: "Min Amount",
    type: "number",
    placeholder: "Min Amount",
    minWidth: 100,
    hidden: true,
  },
  {
    key: "maxAmount",
    label: "Max Amount",
    type: "number",
    placeholder: "Max Amount",
    minWidth: 100,
    hidden: true,
  },
];

/*
Usage examples:

// For bookings:
<GenericFilters
  filters={bookingFilters}
  onUpdateFilter={updateBookingFilter}
  searchConfig={{ placeholder: "Search bookings...", minWidth: 200 }}
  filterConfigs={bookingFilterConfigs}
  simplified={false}
/>

// For services:
<GenericFilters
  filters={serviceFilters}
  onUpdateFilter={updateServiceFilter}
  searchConfig={{ placeholder: "Search services...", minWidth: 200 }}
  filterConfigs={serviceFilterConfigs}
  simplified={true} // Only shows main filters
/>

// For payments:
<GenericFilters
  filters={paymentFilters}
  onUpdateFilter={updatePaymentFilter}
  searchConfig={{ placeholder: "Search payments...", minWidth: 200 }}
  filterConfigs={paymentFilterConfigs}
  simplified={false}
/>
*/
