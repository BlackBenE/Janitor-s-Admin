import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { CrudList } from "../components/CrudList";
import { useDelete } from "../../hooks/useCrud";
import { Tables } from "../../types/database.types";

type Property = Tables<"properties">;

const PropertiesPage = () => {
  const navigate = useNavigate();
  const { deleteOne, loading: deleting } = useDelete("properties");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    property: Property | null;
  }>({
    open: false,
    property: null,
  });

  const handleEdit = (property: Property) => {
    navigate(`/property-approvals/${property.id}/edit`);
  };

  const handleView = (property: Property) => {
    navigate(`/property-approvals/${property.id}`);
  };

  const handleCreate = () => {
    navigate("/property-approvals/create");
  };

  const handleDeleteClick = (property: Property) => {
    setDeleteDialog({ open: true, property });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.property) {
      await deleteOne(deleteDialog.property.id);
      setDeleteDialog({ open: false, property: null });
    }
  };

  // Approval and rejection handlers (to be implemented)
  // const handleApprove = (property: Property) => {
  //   console.log("Approve property:", property.id);
  // };

  // const handleReject = (property: Property) => {
  //   console.log("Reject property:", property.id);
  // };

  const columns = [
    {
      field: "title" as keyof Property,
      label: "Property Title",
      sortable: true,
    },
    {
      field: "city" as keyof Property,
      label: "Location",
      sortable: true,
      render: (value: unknown, record: Property) => {
        const cityValue = value as string;
        return `${cityValue}, ${record.address}`;
      },
    },
    {
      field: "nightly_rate" as keyof Property,
      label: "Nightly Rate",
      sortable: true,
      render: (value: unknown) => {
        const rate = value as number;
        return `$${rate}`;
      },
    },
    {
      field: "bedrooms" as keyof Property,
      label: "Bedrooms",
      render: (value: unknown) => {
        const bedrooms = value as number;
        return bedrooms || "-";
      },
    },
    {
      field: "capacity" as keyof Property,
      label: "Capacity",
      render: (value: unknown) => {
        const capacity = value as number;
        return `${capacity} guests`;
      },
    },
    {
      field: "validation_status" as keyof Property,
      label: "Status",
      render: (value: unknown) => {
        const status = value as string;
        return (
          <Chip
            label={status || "pending"}
            color={
              status === "approved"
                ? "success"
                : status === "rejected"
                ? "error"
                : "warning"
            }
            size="small"
          />
        );
      },
    },
    {
      field: "created_at" as keyof Property,
      label: "Submitted",
      sortable: true,
      render: (value: unknown) => {
        const dateValue = value as string;
        return dateValue ? new Date(dateValue).toLocaleDateString() : "-";
      },
    },
  ];

  return (
    <>
      <CrudList<Property>
        resource="properties"
        title="Property Approvals"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCreate={handleCreate}
        onView={handleView}
        searchable={true}
        filters={{ validation_status: "pending" }} // Show only pending by default
      />

      {/* Custom Action Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            // Bulk approve logic
            console.log("Bulk approve selected properties");
          }}
        >
          Bulk Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            // Bulk reject logic
            console.log("Bulk reject selected properties");
          }}
        >
          Bulk Reject
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, property: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete property &quot;
          {deleteDialog.property?.title}&quot;? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, property: null })}
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

export default PropertiesPage;
