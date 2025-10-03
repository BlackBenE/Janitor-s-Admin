import { FilterConfig } from "../shared/GenericFilters";

export const userFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "validated", label: "Validated" },
      { value: "pending", label: "Pending" },
      { value: "locked", label: "Locked" },
    ],
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    hidden: true,
    options: [
      { value: "traveler", label: "Traveler" },
      { value: "property_owner", label: "Property Owner" },
      { value: "service_provider", label: "Service Provider" },
      { value: "admin", label: "Admin" },
    ],
  },
  {
    key: "subscription",
    label: "Subscription",
    type: "select",
    hidden: true,
    minWidth: 140,
    options: [
      { value: "vip", label: "VIP" },
      { value: "standard", label: "Standard" },
    ],
  },
];

export const propertyFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
      { value: "under_review", label: "Under Review" },
    ],
  },
  {
    key: "city",
    label: "City",
    type: "text",
    placeholder: "City",
    hidden: true,
  },
  {
    key: "country",
    label: "Country",
    type: "text",
    placeholder: "Country",
    hidden: true,
  },
  {
    key: "minPrice",
    label: "Min Price",
    type: "number",
    placeholder: "Min Price",
    minWidth: 100,
    hidden: true,
  },
  {
    key: "maxPrice",
    label: "Max Price",
    type: "number",
    placeholder: "Max Price",
    minWidth: 100,
    hidden: true,
  },
];

export const invoiceFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "pending", label: "Pending" },
      { value: "paid", label: "Paid" },
      { value: "refunded", label: "refunded" },
    ],
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
    type: "select",
    hidden: true,
    options: [
      { value: "bank_transfer", label: "Bank Transfer" },
      { value: "credit_card", label: "Credit Card" },
      { value: "paypal", label: "PayPal" },
      { value: "cash", label: "Cash" },
    ],
  },
];

export const paymentFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "pending", label: "Pending" },
      { value: "paid", label: "Paid" },
      { value: "refunded", label: "Refunded" },
    ],
  },
  {
    key: "paymentType",
    label: "Payment Type",
    type: "select",
    hidden: true,
    options: [
      { value: "booking", label: "Booking Payment" },
      { value: "service", label: "Service Payment" },
      { value: "subscription", label: "Subscription" },
      { value: "refund", label: "Refund" },
    ],
  },
  {
    key: "minAmount",
    label: "Min Amount",
    type: "number",
    placeholder: "Min Amount (€)",
    minWidth: 120,
    hidden: true,
  },
  {
    key: "maxAmount",
    label: "Max Amount",
    type: "number",
    placeholder: "Max Amount (€)",
    minWidth: 120,
    hidden: true,
  },
  {
    key: "dateFrom",
    label: "From Date",
    type: "text",
    placeholder: "YYYY-MM-DD",
    hidden: true,
    minWidth: 150,
  },
  {
    key: "dateTo",
    label: "To Date",
    type: "text",
    placeholder: "YYYY-MM-DD",
    hidden: true,
    minWidth: 150,
  },
];
