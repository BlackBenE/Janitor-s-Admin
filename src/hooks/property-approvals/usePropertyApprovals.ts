import { useState, useEffect } from "react";

export interface PropertyApprovalData {
  Property: string;
  Owner: string;
  Location: string;
  Price: string;
  Status: string;
  Submitted: string;
  Actions: string;
  [key: string]: string | number;
}

export interface PropertyApprovalColumn {
  field: string;
  headerName: string;
}

export const usePropertyApprovals = () => {
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real API calls
  const columns: PropertyApprovalColumn[] = [
    { field: "Property", headerName: "Property" },
    { field: "Owner", headerName: "Owner" },
    { field: "Location", headerName: "Location" },
    { field: "Price", headerName: "Price" },
    { field: "Status", headerName: "Status" },
    { field: "Submitted", headerName: "Submitted" },
    { field: "Actions", headerName: "Actions" },
  ];

  const data: PropertyApprovalData[] = [
    {
      Property: "Luxury Apartment",
      Owner: "John Doe",
      Location: "New York",
      Price: "$3,000",
      Status: "Pending",
      Submitted: "2023-10-01",
      Actions: "Edit | Delete",
    },
    {
      Property: "Cozy Cottage",
      Owner: "Jane Smith",
      Location: "California",
      Price: "$2,500",
      Status: "Approved",
      Submitted: "2023-09-15",
      Actions: "Edit | Delete",
    },
    {
      Property: "Luxury Apartment",
      Owner: "John Doe",
      Location: "New York",
      Price: "$3,000",
      Status: "Pending",
      Submitted: "2023-10-01",
      Actions: "Edit | Delete",
    },
    {
      Property: "Cozy Cottage",
      Owner: "Jane Smith",
      Location: "California",
      Price: "$2,500",
      Status: "Approved",
      Submitted: "2023-09-15",
      Actions: "Edit | Delete",
    },
    {
      Property: "Luxury Apartment",
      Owner: "John Doe",
      Location: "New York",
      Price: "$3,000",
      Status: "Pending",
      Submitted: "2023-10-01",
      Actions: "Edit | Delete",
    },
    {
      Property: "Cozy Cottage",
      Owner: "Jane Smith",
      Location: "California",
      Price: "$2,500",
      Status: "Approved",
      Submitted: "2023-09-15",
      Actions: "Edit | Delete",
    },
    {
      Property: "Luxury Apartment",
      Owner: "John Doe",
      Location: "New York",
      Price: "$3,000",
      Status: "Pending",
      Submitted: "2023-10-01",
      Actions: "Edit | Delete",
    },
    {
      Property: "Cozy Cottage",
      Owner: "Jane Smith",
      Location: "California",
      Price: "$2,500",
      Status: "Approved",
      Submitted: "2023-09-15",
      Actions: "Edit | Delete",
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

  const approveProperty = (propertyId: string) => {
    console.log("Approve property:", propertyId);
  };

  const rejectProperty = (propertyId: string) => {
    console.log("Reject property:", propertyId);
  };

  const handleEdit = (id: string) => {
    console.log("Edit property:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete property:", id);
  };

  return {
    // Data
    columns,
    data,

    // State
    loading,

    // Actions
    approveProperty,
    rejectProperty,
    handleEdit,
    handleDelete,
  };
};
