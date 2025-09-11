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

type Profile = Tables<"profiles">;

const UsersPage = () => {
  const navigate = useNavigate();
  const { deleteOne, loading: deleting } = useDelete("profiles");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: Profile | null;
  }>({
    open: false,
    user: null,
  });

  const handleEdit = (user: Profile) => {
    navigate(`/user-management/${user.id}/edit`);
  };

  const handleView = (user: Profile) => {
    navigate(`/user-management/${user.id}`);
  };

  const handleCreate = () => {
    navigate("/user-management/create");
  };

  const handleDeleteClick = (user: Profile) => {
    setDeleteDialog({ open: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.user) {
      await deleteOne(deleteDialog.user.id);
      setDeleteDialog({ open: false, user: null });
      // Refetch will happen automatically due to the way useList works
    }
  };

  const columns = [
    {
      field: "email" as keyof Profile,
      label: "Email",
      sortable: true,
    },
    {
      field: "full_name" as keyof Profile,
      label: "Full Name",
      sortable: true,
    },
    {
      field: "role" as keyof Profile,
      label: "Role",
      sortable: true,
      render: (value: unknown) => {
        const role = value as string;
        return (
          <Chip
            label={role}
            color={
              role === "admin"
                ? "primary"
                : role === "provider"
                ? "secondary"
                : "default"
            }
            size="small"
          />
        );
      },
    },
    {
      field: "profile_validated" as keyof Profile,
      label: "Validated",
      render: (value: unknown) => {
        const validated = value as boolean;
        return (
          <Chip
            label={validated ? "Yes" : "No"}
            color={validated ? "success" : "warning"}
            size="small"
          />
        );
      },
    },
    {
      field: "vip_subscription" as keyof Profile,
      label: "VIP",
      render: (value: unknown) => {
        const isVip = value as boolean;
        return (
          <Chip
            label={isVip ? "VIP" : "Regular"}
            color={isVip ? "primary" : "default"}
            size="small"
          />
        );
      },
    },
    {
      field: "created_at" as keyof Profile,
      label: "Created",
      sortable: true,
      render: (value: unknown) => {
        const dateValue = value as string;
        return dateValue ? new Date(dateValue).toLocaleDateString() : "-";
      },
    },
  ];

  return (
    <>
      <CrudList<Profile>
        resource="profiles"
        title="User Management"
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
        onClose={() => setDeleteDialog({ open: false, user: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete user &quot;
          {deleteDialog.user?.full_name || deleteDialog.user?.email}&quot;? This
          action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
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

export default UsersPage;
