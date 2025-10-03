import React from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import {
  UserProfile,
  UserActivityData,
  UserTableColumnsProps,
  UserRole,
} from "../../../types/userManagement";
import {
  getActivityHeaderName,
} from "../../../utils/userTableFormatters";
import {
  SelectCell,
  UserInfoCell,
  RoleCell,
  SubscriptionCell,
  StatusCell,
  ActivityCell,
  SpendingCell,
} from "./UserTableCells";
import { UserTableActions } from "./UserTableActions";

/**
 * Configuration des colonnes du tableau utilisateur
 * Version refactorisée avec séparation des responsabilités
 */
export const createUserTableColumns = ({
  selectedUsers,
  activityData,
  currentUserRole,
  currentTabRole,
  onToggleUserSelection,
  onShowUser,
  onShowAudit,
  onPasswordReset,
  onLockAccount,
  onUnlockAccount,
  onViewBookings,
  onManageSubscription,
  onManageServices,
  onToggleVIP,
  onValidateProvider,
}: UserTableColumnsProps) => {
  return [
    {
      field: "select",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <SelectCell
          params={params}
          selectedUsers={selectedUsers}
          onToggleUserSelection={onToggleUserSelection}
        />
      ),
    },
    {
      field: "full_name",
      headerName: "User",
      minWidth: 200,
      flex: 1,
      valueGetter: (value: string | null, row: UserProfile) =>
        `${row.full_name || "Unnamed User"} ${row.email}`,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <UserInfoCell params={params} />
      ),
    },
    {
      field: "role",
      headerName: "Role",
      valueGetter: (value: string) => value?.replace("_", " ") || "",
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <RoleCell params={params} />
      ),
    },
    {
      field: "vip_subscription",
      headerName: "Subscription",
      valueGetter: (value: boolean) => (value ? "VIP" : "Standard"),
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <SubscriptionCell params={params} />
      ),
    },
    {
      field: "profile_validated",
      headerName: "Status",
      valueGetter: (value: boolean, row: UserProfile) => {
        if (row.account_locked) return "Locked";
        return value ? "Validated" : "Pending";
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <StatusCell params={params} />
      ),
    },
    {
      field: "activity",
      headerName: getActivityHeaderName(currentUserRole),
      sortable: false,
      filterable: false,
      valueGetter: (value: string | null, row: UserProfile) => {
        const activity = activityData?.[row.id];
        if (currentUserRole === UserRole.TRAVELER) {
          return activity ? `${activity.totalBookings} bookings` : "0 bookings";
        } else if (currentUserRole === UserRole.PROPERTY_OWNER) {
          return activity
            ? `${activity.totalProperties || 0} properties`
            : "0 properties";
        } else if (currentUserRole === UserRole.SERVICE_PROVIDER) {
          return activity
            ? `${activity.totalServices || 0} services`
            : "0 services";
        }
        return activity ? `${activity.totalBookings} bookings` : "0 bookings";
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <ActivityCell
          params={params}
          activityData={activityData}
          currentUserRole={currentUserRole}
        />
      ),
    },
    {
      field: "spending",
      headerName: "Spending",
      sortable: false,
      filterable: false,
      valueGetter: (value: string | null, row: UserProfile) => {
        const activity = activityData?.[row.id];
        return activity ? activity.totalSpent : 0;
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <SpendingCell params={params} activityData={activityData} />
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <UserTableActions
          params={params}
          currentTabRole={currentTabRole}
          onShowUser={onShowUser}
          onShowAudit={onShowAudit}
          onPasswordReset={onPasswordReset}
          onLockAccount={onLockAccount}
          onUnlockAccount={onUnlockAccount}
          onViewBookings={onViewBookings}
          onManageSubscription={onManageSubscription}
          onManageServices={onManageServices}
          onToggleVIP={onToggleVIP}
          onValidateProvider={onValidateProvider}
        />
      ),
    },
  ];
};