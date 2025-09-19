import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { UserFilters } from "../../types/userManagement";

interface UserFiltersProps {
  filters: UserFilters;
  onUpdateFilter: (key: keyof UserFilters, value: string) => void;
}

export const UserFiltersComponent: React.FC<UserFiltersProps> = ({
  filters,
  onUpdateFilter,
}) => {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <TextField
        size="small"
        placeholder="Search users..."
        value={filters.search}
        onChange={(e) => onUpdateFilter("search", e.target.value)}
        sx={{ minWidth: 200 }}
      />

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Role</InputLabel>
        <Select
          value={filters.role}
          label="Role"
          onChange={(e) => onUpdateFilter("role", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="traveler">traveler</MenuItem>
          <MenuItem value="property_owner">Property Owner</MenuItem>
          <MenuItem value="service_provider">Service Provider</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          label="Status"
          onChange={(e) => onUpdateFilter("status", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="validated">Validated</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="locked">Locked</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Subscription</InputLabel>
        <Select
          value={filters.subscription}
          label="Subscription"
          onChange={(e) => onUpdateFilter("subscription", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="vip">VIP</MenuItem>
          <MenuItem value="standard">Standard</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
