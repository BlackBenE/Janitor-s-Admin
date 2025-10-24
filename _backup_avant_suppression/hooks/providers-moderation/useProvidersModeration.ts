import { useState, useEffect } from "react";

export interface ProviderModerationData {
  Provider: string;
  Service: string;
  Location: string;
  Rating: string;
  Status: string;
  Documents: string;
  [key: string]: string | number;
}

export interface ProviderModerationColumn {
  field: string;
  headerName: string;
}

export const useProvidersModeration = () => {
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real API calls
  const columns: ProviderModerationColumn[] = [
    { field: "Provider", headerName: "Provider" },
    { field: "Service", headerName: "Service" },
    { field: "Location", headerName: "Location" },
    { field: "Rating", headerName: "Rating" },
    { field: "Status", headerName: "Status" },
    { field: "Documents", headerName: "Submitted" },
  ];

  const data: ProviderModerationData[] = [
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
  ];

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const verifyProvider = (providerId: string) => {
    console.log("Verify provider:", providerId);
  };

  const rejectProvider = (providerId: string) => {
    console.log("Reject provider:", providerId);
  };

  const suspendProvider = (providerId: string) => {
    console.log("Suspend provider:", providerId);
  };

  const handleEdit = (id: string) => {
    console.log("Edit provider:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete provider:", id);
  };

  return {
    // Data
    columns,
    data,

    // State
    loading,

    // Actions
    verifyProvider,
    rejectProvider,
    suspendProvider,
    handleEdit,
    handleDelete,
  };
};
