import React from "react";
import { GenericTabs, propertyTabConfigs, getPropertyCount } from "../shared";
import { PropertyStatus } from "../../types/propertyApprovals";

interface PropertyTabsProps {
  activeTab: number;
  properties: any[];
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => void;
}

export const PropertyTabs: React.FC<PropertyTabsProps> = ({
  activeTab,
  properties,
  onTabChange,
}) => {
  return (
    <GenericTabs<any, PropertyStatus>
      activeTab={activeTab}
      items={properties}
      tabConfigs={propertyTabConfigs}
      onTabChange={onTabChange}
      getItemCount={getPropertyCount}
      ariaLabel="property status filter"
    />
  );
};
