import { useState, useEffect } from "react";

export interface ServiceProperty extends Record<string, unknown> {
  Service: string;
  Category: string;
  Providers: string;
  Avg_Price?: string;
  "Avg Price"?: string;
  Popularity: number;
  Status: string;
}

export interface ServiceStats {
  pendingValidations: number;
  moderationCases: number;
  activeUsers: number;
  monthlyRevenue: number;
}

export interface ServiceColumn {
  field: string;
  headerName: string;
}

export const useServicesCatalog = () => {
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real API calls
  const columns: ServiceColumn[] = [
    { field: "Service	", headerName: "Service" },
    { field: "Category", headerName: "Category" },
    { field: "Providers", headerName: "Providers" },
    { field: "Avg Price	", headerName: "Avg Price" },
    { field: "Popularity	", headerName: "Popularity" },
    { field: "Status", headerName: "Status" },
  ];

  const data: ServiceProperty[] = [
    {
      Service: "Home Cleaning",
      Category: "Home Services",
      Providers: "Acme Cleaners",
      Popularity: 87,
      Status: "Active",
    },
    {
      Service: "Lawn Maintenance",
      Category: "Outdoor",
      Providers: "GreenThumb Ltd.",
      Popularity: 72,
      Status: "Inactive",
    },
    {
      Service: "Plumbing Repair",
      Category: "Home Repair",
      Providers: "PipeWorks",
      Popularity: 64,
      Status: "Pending",
    },
    {
      Service: "Dog Walking",
      Category: "Pet Care",
      Providers: "Paws & Co.",
      Popularity: 90,
      Status: "Active",
    },
    {
      Service: "Personal Training",
      Category: "Wellness",
      Providers: "FitLife",
      Popularity: 81,
      Status: "Active",
    },
  ];

  const stats: ServiceStats = {
    pendingValidations: 1200,
    moderationCases: 1200,
    activeUsers: 1200,
    monthlyRevenue: 1200,
  };

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (id: string) => {
    console.log("Edit item:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete item:", id);
  };

  return {
    // Data
    columns,
    data,
    stats,

    // State
    loading,

    // Actions
    handleEdit,
    handleDelete,
  };
};
