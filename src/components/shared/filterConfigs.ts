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
