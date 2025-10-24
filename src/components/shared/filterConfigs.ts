import { FilterConfig } from "../shared/GenericFilters";
import { LABELS } from "../../constants";

export const userFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: LABELS.common.fields.status,
    type: "select",
    options: [
      { value: "validated", label: LABELS.users.status.validated },
      { value: "pending", label: LABELS.users.status.pending },
      { value: "locked", label: LABELS.users.status.locked },
    ],
  },
  {
    key: "role",
    label: LABELS.common.fields.role,
    type: "select",
    hidden: true,
    options: [
      { value: "traveler", label: LABELS.users.roles.traveler },
      { value: "property_owner", label: LABELS.users.roles.property_owner },
      { value: "service_provider", label: LABELS.users.roles.service_provider },
      { value: "admin", label: LABELS.users.roles.admin },
    ],
  },
  {
    key: "subscription",
    label: LABELS.users.table.headers.subscription,
    type: "select",
    hidden: true,
    minWidth: 140,
    options: [
      { value: "vip", label: LABELS.users.subscription.vip },
      { value: "standard", label: LABELS.users.subscription.standard },
    ],
  },
];

export const propertyFilterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: LABELS.common.fields.status,
    type: "select",
    options: [
      { value: "pending", label: LABELS.common.status.pending },
      { value: "approved", label: LABELS.common.status.approved },
      { value: "rejected", label: LABELS.common.status.rejected },
      { value: "under_review", label: "En révision" },
    ],
  },
  {
    key: "city",
    label: LABELS.common.fields.city,
    type: "text",
    placeholder: LABELS.common.fields.city,
    hidden: true,
  },
  {
    key: "country",
    label: LABELS.common.fields.country,
    type: "text",
    placeholder: LABELS.common.fields.country,
    hidden: true,
  },
  {
    key: "minPrice",
    label: "Prix minimum",
    type: "number",
    placeholder: "Prix minimum",
    minWidth: 100,
    hidden: true,
  },
  {
    key: "maxPrice",
    label: "Prix maximum",
    type: "number",
    placeholder: "Prix maximum",
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
