import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { CrudList } from "../components/CrudList";
import { useDelete } from "../../hooks/useCrud";
import { Tables } from "../../types/database.types";

type ServiceRequest = Tables<"service_requests">;

const ServiceRequestsPage = () => {
  const navigate = useNavigate();
  const { deleteOne, loading: deleting } = useDelete("service_requests");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    request: ServiceRequest | null;
  }>({
    open: false,
    request: null,
  });

  const handleEdit = (request: ServiceRequest) => {
    navigate(`/quote-requests/${request.id}/edit`);
  };

  const handleView = (request: ServiceRequest) => {
    navigate(`/quote-requests/${request.id}`);
  };

  const handleCreate = () => {
    navigate("/quote-requests/create");
  };

  const handleDeleteClick = (request: ServiceRequest) => {
    setDeleteDialog({ open: true, request });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.request) {
      await deleteOne(deleteDialog.request.id);
      setDeleteDialog({ open: false, request: null });
    }
  };

  const columns = [
    {
      field: "id" as keyof ServiceRequest,
      label: "Request ID",
      render: (value: string) => value.slice(0, 8) + "...",
    },
    {
      field: "service_id" as keyof ServiceRequest,
      label: "Service",
      render: (value: string) => value.slice(0, 8) + "...",
    },
    {
      field: "requester_id" as keyof ServiceRequest,
      label: "Requester",
      render: (value: string) => value.slice(0, 8) + "...",
    },
    {
      field: "requested_date" as keyof ServiceRequest,
      label: "Requested Date",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      field: "total_amount" as keyof ServiceRequest,
      label: "Amount",
      sortable: true,
      render: (value: number) => `$${value}`,
    },
    {
      field: "status" as keyof ServiceRequest,
      label: "Status",
      render: (value: string) => (
        <Chip
          label={value || "pending"}
          color={
            value === "completed"
              ? "success"
              : value === "cancelled"
              ? "error"
              : value === "in_progress"
              ? "info"
              : "warning"
          }
          size="small"
        />
      ),
    },
    {
      field: "duration_minutes" as keyof ServiceRequest,
      label: "Duration",
      render: (value: number) => (value ? `${value} min` : "-"),
    },
    {
      field: "created_at" as keyof ServiceRequest,
      label: "Created",
      sortable: true,
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
  ];

  return (
    <>
      <CrudList<ServiceRequest>
        resource="service_requests"
        title="Quote Requests"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCreate={handleCreate}
        onView={handleView}
        searchable={true}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, request: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this service request? This action
          cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, request: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServiceRequestsPage;
