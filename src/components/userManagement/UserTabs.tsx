import React from "react";
import { GenericTabs, userTabConfigs, getUserCount } from "../shared";
import { UserRole } from "../../types/userManagement";
import { UserProfile } from "../../types/userManagement";

interface UserTabsProps {
  activeTab: number;
  users: UserProfile[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
}

export const UserTabs: React.FC<UserTabsProps> = ({
  activeTab,
  users,
  onTabChange,
}) => {
  return (
    <GenericTabs<UserProfile, UserRole | null>
      activeTab={activeTab}
      items={users}
      tabConfigs={userTabConfigs}
      onTabChange={onTabChange}
      getItemCount={getUserCount}
      ariaLabel="user type filter"
    />
  );
};
