import { FilterConfig } from '@/shared/components/filters/GenericFilters';
import { COMMON_LABELS } from '@/shared/constants';
import { USERS_LABELS } from '@/features/users/constants';

export const userFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: COMMON_LABELS.fields.status,
    type: 'select',
    options: [
      { value: 'validated', label: USERS_LABELS.status.validated },
      { value: 'pending', label: USERS_LABELS.status.pending },
      { value: 'locked', label: USERS_LABELS.status.locked },
    ],
  },
  {
    key: 'role',
    label: COMMON_LABELS.fields.role,
    type: 'select',
    hidden: true,
    options: [
      { value: 'traveler', label: USERS_LABELS.roles.traveler },
      { value: 'property_owner', label: USERS_LABELS.roles.property_owner },
      { value: 'service_provider', label: USERS_LABELS.roles.service_provider },
      { value: 'admin', label: USERS_LABELS.roles.admin },
    ],
  },
  {
    key: 'subscription',
    label: USERS_LABELS.table.headers.subscription,
    type: 'select',
    hidden: true,
    minWidth: 140,
    options: [
      { value: 'vip', label: USERS_LABELS.subscription.vip },
      { value: 'standard', label: USERS_LABELS.subscription.standard },
    ],
  },
];

export const propertyFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: COMMON_LABELS.fields.status,
    type: 'select',
    options: [
      { value: 'pending', label: COMMON_LABELS.status.pending },
      { value: 'approved', label: COMMON_LABELS.status.approved },
      { value: 'rejected', label: COMMON_LABELS.status.rejected },
      { value: 'under_review', label: 'En révision' },
    ],
  },
  {
    key: 'city',
    label: COMMON_LABELS.fields.city,
    type: 'text',
    placeholder: COMMON_LABELS.fields.city,
    hidden: true,
  },
  {
    key: 'country',
    label: COMMON_LABELS.fields.country,
    type: 'text',
    placeholder: COMMON_LABELS.fields.country,
    hidden: true,
  },
  {
    key: 'minPrice',
    label: 'Prix minimum',
    type: 'number',
    placeholder: 'Prix minimum',
    minWidth: 100,
    hidden: true,
  },
  {
    key: 'maxPrice',
    label: 'Prix maximum',
    type: 'number',
    placeholder: 'Prix maximum',
    minWidth: 100,
    hidden: true,
  },
];

export const invoiceFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'paid', label: 'Paid' },
      { value: 'refunded', label: 'refunded' },
    ],
  },
  {
    key: 'paymentMethod',
    label: 'Payment Method',
    type: 'select',
    hidden: true,
    options: [
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'credit_card', label: 'Credit Card' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'cash', label: 'Cash' },
    ],
  },
];

export const paymentFilterConfigs: FilterConfig[] = [
  {
    key: 'paymentType',
    label: 'Payment Type',
    type: 'select',
    hidden: true,
    options: [
      { value: 'booking', label: 'Booking Payment' },
      { value: 'service', label: 'Service Payment' },
      { value: 'subscription', label: 'Subscription' },
      { value: 'refund', label: 'Refund' },
    ],
  },
  {
    key: 'minAmount',
    label: 'Min Amount',
    type: 'number',
    placeholder: 'Min Amount (€)',
    minWidth: 120,
    hidden: true,
  },
  {
    key: 'maxAmount',
    label: 'Max Amount',
    type: 'number',
    placeholder: 'Max Amount (€)',
    minWidth: 120,
    hidden: true,
  },
  {
    key: 'dateFrom',
    label: 'From Date',
    type: 'text',
    placeholder: 'YYYY-MM-DD',
    hidden: true,
    minWidth: 150,
  },
  {
    key: 'dateTo',
    label: 'To Date',
    type: 'text',
    placeholder: 'YYYY-MM-DD',
    hidden: true,
    minWidth: 150,
  },
];
