import { useState, useEffect } from "react";

export interface InvoiceProperty {
  Property: string;
  Owner: string;
  Location: string;
  Price: string;
  Status: string;
  Submitted: string;
  Actions: string;
  [key: string]: unknown;
}

export interface InvoiceStats {
  pendingValidations: number;
  moderationCases: number;
  activeUsers: number;
  monthlyRevenue: number;
}

export interface InvoiceColumn {
  field: string;
  headerName: string;
}

export const useInvoices = () => {
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real API calls
  const columns: InvoiceColumn[] = [
    { field: "Property", headerName: "Property" },
    { field: "Owner", headerName: "Owner" },
    { field: "Location", headerName: "Location" },
    { field: "Price", headerName: "Price" },
    { field: "Status", headerName: "Status" },
    { field: "Submitted", headerName: "Submitted" },
    { field: "Actions", headerName: "Actions" },
  ];

  const data: InvoiceProperty[] = [
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

  const stats: InvoiceStats = {
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

  const markAsPaid = (invoiceId: string) => {
    console.log("Mark as paid:", invoiceId);
  };

  const processRefund = (invoiceId: string) => {
    console.log("Process refund:", invoiceId);
  };

  const handleEdit = (id: string) => {
    console.log("Edit invoice:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete invoice:", id);
  };

  return {
    // Data
    columns,
    data,
    stats,

    // State
    loading,

    // Actions
    markAsPaid,
    processRefund,
    handleEdit,
    handleDelete,
  };
};
